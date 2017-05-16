<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="药品分类" prop="cate_id">
					<el-select v-model="filters.cate_id" clearable placeholder="请选择">
						<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="药品品牌" prop="brand_id">
					<el-select v-model="filters.brand_id" clearable placeholder="请选择">
						<el-option
								v-for="item in option"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="name" label="药品名称" width="120"  sortable>
			</el-table-column>
			<el-table-column prop="sn_code"   label="条形码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="batch_number" label="国药准字号" width="130" sortable>
			</el-table-column>
			<el-table-column prop="status" label="药品状态" width="120" sortable>
			</el-table-column>
			<el-table-column prop="unit" label="单位" min-width="120" sortable>
			</el-table-column>
		</el-table>
		<el-pagination v-bind:current-Page="start" v-bind:page-size="length" :total="total"
					   layout="total,sizes,prev,pager,next,jumper" v-bind:page-sizes="pageSizes"
					   v-on:size-change="sizeChange" v-on:current-change="pageIndexChange">
		</el-pagination>
		<div class="block">
			<span class="wrapper">
			<el-button type="success"  @click="assign">指派</el-button>
				<el-button type="info"  @click="Returns">返回</el-button>
		  </span>
		</div>
	</section>
</template>

<script>
    import {DrugRequest,Designate,drugsCateRequest,BrandsRequest} from '../../fetch/api';

    export default {
        data() {
            return {
                filters: {
                    name: '',
                    cate_id:'',
                    brand_id:''
                },
                options:[],
                option:[],
                sn_code:'',
                batch_number:'',
                status: '1',
                unit:'',
                users: [],
                total: 0,
                sels: [],
                listLoading: false,
                start:0,
                length:10,
                pageSizes:[10,20,50,100],
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },

            }
        },
        methods: {
            Returns(){
                this.$router.back(-1)
			},
            sizeChange: function (length) {
                this.length = length;
                this.getUsers();
            },
            pageIndexChange: function (start) {
                this.start = start;
                this.getUsers();
            },

            //获取用户列表
            getUsers() {
                BrandsRequest().then((res) => {
                    this.options=[];
                    for (let i=0; i<res.data.data.length; i++){
                        this.options.push({
                            value: res.data.data[i].id,
                            label: res.data.data[i].name,
                        })
                    }

                });
                drugsCateRequest().then((res) => {
                    this.option=[];
                    for (let i=0; i<res.data.data.length; i++){
                        this.option.push({
                            value: res.data.data[i].id,
                            label: res.data.data[i].brand_name,

                        })
                    }
                });
                let para = {
                    name: this.filters.name,
                    start:this.start,
                    length:this.length,
                    cate_id:this.filters.cate_id,
                    brand_id:this.filters.brand_id,
                    user_id: this.$route.query.user_id,
                    user_type:1,
                };
                DrugRequest(para).then((res) => {
                    for (let i=0; i<res.data.data.length; i++){
                        if(res.data.data[i].status==1){
                            res.data.data[i].status='上架'
                        }else {
                            res.data.data[i].status='下架'
                        }
                    }
                    this.total = res.data.total;
                    this.users = res.data.data;
                    this.listLoading = false;
                }).catch((err) => {console.log(err)})

            },
            assign(){
				let para=this.sels;
				console.log(this.sels)
               if(this.sels.length==0){
                   this.$message({
                       message: '请选择要指派的商品',
                       type: 'error',
                   });
			   }else {
                   Designate(this.sels).then(data => {
                       this.addLoading = false;
                       this.$message({
                           message: '提交成功',
                           type: 'success',
                       });
                       this.addFormVisible = false;
                       this.getUsers();
                   })

			   }

			},
            selsChange: function(sels) {
            this.sels=[];
                let user_id= this.$route.query.user_id;
                let user_type= this.$route.query.user_type;
				for(var i=0;i<sels.length;i++){
                    this.sels.push({
                        drug_id:sels[i].id,
						user_id:user_id,
                        user_type:user_type
					}
                    )

				}
            }
        },
        mounted() {
            this.getUsers();
        }
    }

</script>

<style >
	.el-dialog .el-dialog__body .el-form.el-form-item.is-required .el-form-item__label:before {
		content: '*';
		color: #ff4949;
		margin-right: 3px;
		display: none;
	}
	.inputCss{
		width:20px;
	}
	.wrapper{
		margin-left:50%;
	}
	.el-form .el-form-item.is-required .el-form-item__label:before {
		content: '*';
		color: #ff4949;
		margin-right: 4px;
		display: none;
	}
	.el-dialog__body .el-form .el-form-item .el-form-item__label{
		width: 100px !important;
	}
	.el-dialog__body .el-form .el-form-item .el-form-item__content{
		margin-left: 100px !important;
	}

</style>