import axios from 'axios';
const baseUrl='http://www.test.api/api';
/*医院列表*/
export const TableRequestLogin = params => { return axios.get(`${baseUrl}/hospitals`, { params: params })};
export const TableCompile = params => { return  axios.put(`${baseUrl}/hospitals`+'/'+params.id,params).then(res => res.data); };
export const TableAdded = params => { return axios.post(`${baseUrl}/hospitals`, params).then(res => res.data); };
export const TableDelete = params => { return axios.delete(`${baseUrl}/hospitals`+'/'+params); };
/*门诊列表*/
export const FormRequestLogin = params => { return axios.get(`${baseUrl}/departments`, { params: params })};
export const FormCompile = params => { return  axios.put(`${baseUrl}/departments`+'/'+params.id,params).then(res => res.data); };
export const FormAdded = params => { return axios.post(`${baseUrl}/departments`, params).then(res => res.data); };
export const FormDelete = params => { return axios.delete(`${baseUrl}/departments`+'/'+params); };
/*下拉搜索*/
export const SearchRequestLogin = params => { return axios.get(`${baseUrl}/hospital`, { params: params })};
/*药品列表*/
export const DruglistRequestLogin = params => { return axios.get(`${baseUrl}/drugs`, { params: params })};
export const DruglistCompile = params => { return  axios.put(`${baseUrl}/drugs`+'/'+params.id,params).then(res => res.data); };
export const DruglistAdded = params => { return axios.post(`${baseUrl}/drugs`, params).then(res => res.data); };
export const DruglistDelete = params => { return axios.delete(`${baseUrl}/drugs`+'/'+params); };

/*药品品牌*/
export const drugsCateRequest = params => { return axios.get(`${baseUrl}/brands`, { params: params })};
export const drugsCateCompile = params => { return  axios.put(`${baseUrl}/brands`+'/'+params.id,params).then(res => res.data); };
export const drugsCateAdded = params => { return axios.post(`${baseUrl}/brands`, params).then(res => res.data); };
export const drugsCateDelete = params => { return axios.delete(`${baseUrl}/brands`+'/'+params); };

/*药品分类*/
export const BrandsRequest = params => { return axios.get(`${baseUrl}/drugcate`, { params: params })};
export const BrandsCompile = params => { return  axios.put(`${baseUrl}/drugcate`+'/'+params.id,params).then(res => res.data); };
export const BrandsAdded = params => { return axios.post(`${baseUrl}/drugcate`, params).then(res => res.data); };
export const BrandsDelete = params => { return axios.delete(`${baseUrl}/drugcate`+'/'+params); };
/*上传图片*/
export const ImagesRequest = params => { return axios.get(`${baseUrl}/qiniutoken?key=`+params,params)};
/*代理列表*/
export const HomeRequest = params => { return axios.get(`${baseUrl}/agents`, { params: params })};
/*药品授权*/
export const DrugRequest = params => { return axios.get(`${baseUrl}/drugspermission`, { params: params })};
export const Designate = params => { return axios.post(`${baseUrl}/drugspermission`, params).then(res => res.data); };
export const DrugCateCompile = params => { return  axios.put(`${baseUrl}/drugspermission`+'/'+params.user_id,params).then(res => res.data); }
/*医生列表*/
export const ThedoctorRequest = params => { return axios.get(`${baseUrl}/patients?key=`+params,params)};

/*患者列表*/
export const PatientRequest = params => { return axios.get(`${baseUrl}/patients?key=`+params,params)};
/*处方管理orders*/
export const RecipeRequestLogin = params => { return axios.get(`${baseUrl}/orders`, { params: params })};
export const RecipeCompile = params => { return  axios.put(`${baseUrl}/orders`+'/'+params.id,params).then(res => res.data); };
export const RecipeAdded = params => { return axios.post(`${baseUrl}/orders`, params).then(res => res.data); };
export const RecipeDelete = params => { return axios.delete(`${baseUrl}/orders`+'/'+params); };
/*生成二维码*/
export const QuickMark = params => { return axios.get(`${baseUrl}/qrcode`, { params: params })};
