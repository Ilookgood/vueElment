/**
 * Created by Administrator on 2017/5/11 0011.
 */
const  vendor={};
vendor.getNameByCode =(code, dicArray)=>{
    if(code==undefined){return code}
    if(code=='' || code== '/' ||code=='\\'){
        return code
    }else{
         if(Array.isArray(dicArray)){
             if(dicArray.length==0){
                 return ''
             }else {
                 for(var index in dicArray){
                     if(dicArray[index].code==code){
                         return dicArray[index].name
                     }
                 }
             }
         }else {
             return ''
         }
         return ''

    }
};
export  default  vendor