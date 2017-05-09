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
		  </span>
		</div>
	</section>
</template>

<script>

    import NProgress from 'nprogress'
    import axios from 'axios';
    import moment from 'moment'
    var baseUrl = 'http://www.test.api/api/';

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
                this.$http.get(baseUrl+"drugcate?").then(
                    (res) => {
                        this.options=[];
                        for (let i=0; i<res.body.data.length; i++){
                            this.options.push({
                                value: res.body.data[i].id,
                                label: res.body.data[i].name,
                            })
                        }
                    }
                )
                this.$http.get(baseUrl+"brands?").then(
                    (res) => {
                        this.option=[];
                        for (let i=0; i<res.body.data.length; i++){
                            this.option.push({
                                value: res.body.data[i].id,
                                label: res.body.data[i].brand_name,
                            })
                        }

                    }
                )
                let para = {
                    name: this.filters.name,
                    cate_id:this.filters.cate_id,
                    brand_id:this.filters.brand_id
                };
                console.log(para.cate_id)
                console.log(para.brand_id)
                let user_id= this.$route.query.user_id;
                this.$http.get(baseUrl+"drugspermission?user_type="+ 1 +"&user_id="+user_id +"&start="+this.start +"&length="+this.length+"&name="+para.name).then(
                    (res) => {
                        // 处理成功的结果
                        for (let i=0; i<res.body.data.length; i++){
                            if(res.body.data[i].status==1){
                                res.body.data[i].status='上架'
                            }else {
                                res.body.data[i].status='下架'
                            }
                        }
                        this.total = res.body.total
                        this.users = res.body.data
                        this.listLoading = false

                    }, (ere) => {
                        // 处理失败的结果
                        console.log(ere)
                    }
                )

            },


            assign(){
                let url = baseUrl+'drugspermission';
                this.$http.post(url,this.sels).then(
                    (res) => {
                        this.addLoading = true;
                        this.$message({
                            message: '提交成功',
                            type: 'success',
                        });
                        this.editFormVisible = false;
                        this.getUsers();

                    },(ere) => {
                        this.$message({
                            message: '请检查提交内容是否完整',
                            type: 'error',
                        });
                    }
                )
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