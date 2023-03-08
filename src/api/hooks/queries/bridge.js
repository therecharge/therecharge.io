import { useMutation, useQuery } from 'react-query'
import { fetchGetBridges, fetchGetBalance } from '../data/bridge'

export const useGetBridges = () => {
  return useQuery({
    queryKey: ['bridges'],
    queryFn: queryFunctionContext => {
      return fetchGetBridges()
    }
  })
}

export const useGetBalance = (params, enabled) => {
  return useQuery({
    queryKey: ['balance', params],
    queryFn: queryFunctionContext => {
      return fetchGetBalance(queryFunctionContext.queryKey[1])
    },
    enabled: enabled
  })
}
