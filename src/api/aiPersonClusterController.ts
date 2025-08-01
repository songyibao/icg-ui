// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** listClusterDetectedFaces GET /api/ai/person_cluster/detected_faces */
export async function listClusterDetectedFacesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listClusterDetectedFacesUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListAiDetectedFaceVO_>('/api/ai/person_cluster/detected_faces', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listPersionCluster GET /api/ai/person_cluster/list */
export async function listPersionClusterUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListAiPersonClusterVO_>('/api/ai/person_cluster/list', {
    method: 'GET',
    ...(options || {}),
  })
}

/** reconstructPersonCluster GET /api/ai/person_cluster/reconstruct */
export async function reconstructPersonClusterUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/ai/person_cluster/reconstruct', {
    method: 'GET',
    ...(options || {}),
  })
}
