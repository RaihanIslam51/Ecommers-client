'use client';

import { useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';

/**
 * Custom hook for API calls
 * @returns {Object} { data, loading, error, request }
 */
export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, body = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await axiosInstance.get(url, config);
          break;
        case 'POST':
          response = await axiosInstance.post(url, body, config);
          break;
        case 'PUT':
          response = await axiosInstance.put(url, body, config);
          break;
        case 'PATCH':
          response = await axiosInstance.patch(url, body, config);
          break;
        case 'DELETE':
          response = await axiosInstance.delete(url, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
};

/**
 * Custom hook for GET requests
 * @param {string} url - API endpoint
 * @param {Object} config - Axios config
 * @returns {Object} { data, loading, error, refetch }
 */
export const useGet = (url, config = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(url, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, config]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for POST requests
 * @returns {Object} { data, loading, error, post }
 */
export const usePost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = useCallback(async (url, body, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(url, body, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to post data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, post };
};

/**
 * Custom hook for PUT requests
 * @returns {Object} { data, loading, error, put }
 */
export const usePut = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const put = useCallback(async (url, body, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.put(url, body, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, put };
};

/**
 * Custom hook for DELETE requests
 * @returns {Object} { data, loading, error, remove }
 */
export const useDelete = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.delete(url, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, remove };
};
