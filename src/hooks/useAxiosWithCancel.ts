import { useEffect, useRef, useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios-config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface UseAxiosState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAxiosOptions {
  manual?: boolean;
  useCache?: boolean;
}

export function useAxiosWithCancel<T = any>(
  config: AxiosRequestConfig | null,
  options: UseAxiosOptions = {}
) {
  const [state, setState] = useState<UseAxiosState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const executeRequest = useCallback(async (requestConfig: AxiosRequestConfig) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Add abort signal to request config
    const configWithAbort = {
      ...requestConfig,
      signal: abortControllerRef.current.signal,
    };

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response: AxiosResponse<T> = await axiosInstance(configWithAbort);
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      }
      
      return response;
    } catch (error: any) {
      // Only update state if component is still mounted and error is not cancellation
      if (isMountedRef.current) {
        if (error.name === 'AbortError' || error.message === 'Request cancelled') {
          // Request was cancelled - don't update state
          return;
        }
        
        setState({
          data: null,
          loading: false,
          error: error.message || 'An error occurred',
        });
      }
      
      throw error;
    }
  }, []);

  const refetch = async () => {
    if (config) {
      return executeRequest(config);
    }
  };

  // Execute request on mount if not manual
  useEffect(() => {
    if (!options.manual && config) {
      executeRequest(config);
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [config, executeRequest, options.manual]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return [state, refetch] as const;
}

// Manual request hook
export function useManualAxios<T = any>() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const executeRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Add abort signal to request config
    const configWithAbort = {
      ...config,
      signal: abortControllerRef.current.signal,
    };

    try {
      const response = await axiosInstance(configWithAbort);
      return response;
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message === 'Request cancelled') {
        // Request was cancelled - don't throw error
        throw new Error('Request cancelled');
      }
      throw error;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return executeRequest;
}
