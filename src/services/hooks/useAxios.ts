import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

// axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
// url, method, body = null, headers = null
export function useAxios(axiosParams: AxiosRequestConfig): {
  response: any;
  error: string;
  loading: boolean;
} {
  const [response, setResponse] = useState(undefined);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async (params: AxiosRequestConfig) => {
    try {
      const result = await axios.request(params);
      setResponse(result.data);
    } catch (error: any) {
      setError(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(axiosParams);
  }, [axiosParams]);

  return { response, error, loading };
}
