import fetch from 'node-fetch';

export interface ApiResponse {
  statusCode: number,
  data: ApiData
}

export interface ApiData {
  c: number,
  d: number,
  dp: number,
  h: number,
  l: number,
  o: number,
  pc: number,
  t: number,
}

const fetchData = async (url: string): Promise<ApiResponse> => {
  const response = await fetch(url);
  const statusCode = response.status;
  const data = await response.json();
  return { data, statusCode };
};

export default {
  fetchData,
};
