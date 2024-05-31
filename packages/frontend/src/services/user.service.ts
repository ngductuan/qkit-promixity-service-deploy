import { API_ENDPOINT } from '@/constants'
import { baseQueryWithAuth } from '@/constants/baseQuery'
import { HttpClient } from '@/models/http-client/http-client'
import { HttpRequestParamsInterface } from '@/models/http-client/http-request-params.interface'
import { IPaginationResponse } from '@/types/pagination'
import { GetAllUsersQuery } from '@/types/query'
import { IUserInformation } from '@/types/user'
import { createApi } from '@reduxjs/toolkit/query/react'
import { omit } from 'lodash-es'

export const getMyProfile = (userId: string): Promise<IUserInformation> => {
  const params: HttpRequestParamsInterface = {
    requiresToken: true,
    url: `${API_ENDPOINT}/users/${userId}`
  }

  return HttpClient.get(params)
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['UserInfo', 'UserList'],
  endpoints: (builder) => ({
    // /user
    getProfile: builder.query<IUserInformation, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'GET'
      }),
      providesTags: ['UserInfo']
    }),

    // /admin
    getAllUsers: builder.query<IPaginationResponse<IUserInformation>, GetAllUsersQuery>({
      query: (params) => ({
        url: `/admin/users`,
        method: 'GET',
        params
      }),
      providesTags: ['UserList']
    }),
    updateUserRole: builder.mutation<void, { role: string; id: string }>({
      query: (payload) => ({
        url: `/admin/users/${payload.id}/role`,
        method: 'PATCH',
        body: omit(payload, 'id')
      }),
      invalidatesTags: ['UserList']
    }),
    deleteUser: builder.mutation<void, { deleteType: string; id: string }>({
      query: (payload) => ({
        url: `/admin/users/${payload.id}`,
        method: 'DELETE',
        params: { deleteType: payload.deleteType }
      }),
      invalidatesTags: ['UserList']
    })
  })
})

export const { useGetProfileQuery, useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserRoleMutation } = userApi
