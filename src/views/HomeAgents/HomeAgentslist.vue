<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.username" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getBrand">查询</el-button>
				</el-form-item>
				<!--	<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>	-->
			</el-form>
		</el-col>
		
		<!--列表-->
		<el-table :data="brands" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column prop="username" label="用户名" sortable>
			</el-table-column>
			<el-table-column prop="status" label="用户状态" sortable>
			</el-table-column>
			<el-table-column prop="real_name" label="真实姓名" sortable>
			</el-table-column>
			<el-table-column prop="id_number" label="身份证号" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="电话号码" sortable>
			</el-table-column>
			<!--<el-table-column label="操作" width="150px">
			&lt;!&ndash;<template scope="scope">
				<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
			</template>&ndash;&gt;
		</el-table-column>-->
		</el-table>
		
		<!--新增-->	
<!--		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="品牌名称" prop="brand_name">
					<el-input v-model="addForm.brand_name" auto-complete="off"></el-input>
				</el-form-item>
              &lt;!&ndash; <el-upload
                        class="upload-demo"
                        action="http://upload.qiniu.com/"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :show-file-list="true"
                        :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>&ndash;&gt;

				&lt;!&ndash;	<el-upload
							action="http://upload.qiniu.com/"
							type="drag"
							:on-success="handleSuccess"
							:on-error="handleError"
							:data="form"
					>
						<i class="el-icon-upload"></i>
					</el-upload>&ndash;&gt;

              <form method="post" action="http://upload.qiniu.com/"
                      enctype="multipart/form-data">
                    <input name="key" type="hidden" value="12345678">
                    <input name="token" type="hidden" value="MhWG-QsCNhHHpD9jKfdh97OL3vZ-IMsVawjXlpHh:mBV1YiP-nmG-XxD30stqrSQGmUA=:eyJzY29wZSI6ImxpcXVueCIsImRlYWRsaW5lIjoxNDkzNzI2MjQzLCJ1cEhvc3RzIjpbImh0dHA6XC9cL3VwLXoyLnFpbml1LmNvbSIsImh0dHA6XC9cL3VwbG9hZC16Mi5xaW5pdS5jb20iLCItSCB1cC16Mi5xaW5pdS5jb20gaHR0cDpcL1wvMTgzLjYwLjIxNC4xOTgiXX0=">
                    <input name="file" type="file" />
              </form>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>-->
		
		<!--编辑--->
	<!--	<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="品牌名称" prop="brand_name">
					<el-input v-model="editForm.brand_name" auto-complete="off"></el-input>
				</el-form-item>				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>-->
		
		<!--工具条-->
		<el-pagination v-bind:current-Page="start" v-bind:page-size="length" :total="total"
					   layout="total,sizes,prev,pager,next,jumper" v-bind:page-sizes="pageSizes"
					   v-on:size-change="sizeChange" v-on:current-change="pageIndexChange">
		</el-pagination>
		
		
		
	</section>
</template>
<script>
	/*import Search from './Search'*/
    import axios from 'axios';
	var baseUrl = 'http://www.test.api/api/';	
	
	export default {
		data() {
			return {
				filters: {
                    username: ''
				},
				loading: false,
				brands:[],
				start:0,
				length:10,
				total:0,
                status:'',
                real_name:'',
                id_number:'',
                phone:'',
				pageSizes:[10,20,50,100],
				//新增
				addFormVisible: false,
				addLoading: false,
				//编辑
			}		
		},

		methods: {
			//分页
			sizeChange: function (length) {
                this.length = length;
                this.getBrand();
            },
            pageIndexChange: function (start) {
                this.start = start;
                this.getBrand();
            },

			
			//获取用户列表
			getBrand: function () {
				let para = {
                    username: this.filters.username,
                    status: this.status,
                    phone: this.phone,
                    real_name: this.real_name,
                    id_number: this.id_number
				};
	         	this.loading = true;
				this.$http.get(baseUrl+"agents?start="+ this.start + "&length="+this.length+"&name="+para.username+"&status="+para.status+"&phone="+para.phone+"&real_name="+para.real_name+"&id_number="+para.id_number).then(
				(res) => {			
					// 处理成功的结果
                    for (let i=0; i<res.body.data.length; i++){
                        if(res.body.data[i].status==1){
                            res.body.data[i].status='可用'
                        }else {
                            res.body.data[i].status='不可用'
                        }
                    }
					this.total   = res.body.total;
					this.brands  = res.body.data;
					this.loading = false;
				},(ere) => {
				
				}
              )
			},

			//新增
	/*		addSubmit: function () {
                this.$refs.addForm.validate((valid) => {					    
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = false;

                            let para = Object.assign({}, this.addForm);
                            let jsonli = {'brand_name':para.brand_name,'image_url':para.image_url}							
                            this.$http.post(baseUrl+"brands",jsonli,{emulateJSON: true}).then(
                                (res) => {
                                    // 处理成功的结果
                                    this.getBrand();
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success',
                                    });
									this.addLoading = false;									
                                    this.addFormVisible = false;                              
                                    
                                },(ere)=>{
																	
                                }
                            )
                        });
                    }
                });
            },
			*/
/*			//显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },*/
			
			//编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            let jsonli = {'brand_name':para.brand_name,'image_url':para.image_url,}               
                            this.$http.put(baseUrl+'brands/'+para.id,jsonli).then(
                                (res) => {
                                    // 处理成功的结果
                                    this.editLoading = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success',
                                    });
                                    this.editFormVisible = false;
                                    this.getBrand();
                                },(ere) => {
                                    console.log(ere)
                                }
                            )
                        });
                    }
                });
            },			
			//删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                          
                    let para = { id: row.id };				
                    let url=baseUrl+'brands'
                    this.$http.delete(url+'/'+para.id).then(
                        (res) => {
                            // 处理成功的结果
                          
							this.getBrand();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });			
                        },(ere) => {
						
                        }
                    )

                }).catch(() => {

                });
            },
		},
		
		mounted() {
			this.getBrand();
		}
		
	};
</script>
<style scoped>
	.el-dialog .el-dialog__body .el-form.el-form-item.is-required .el-form-item__label:before {
		content: '*';
		color: #ff4949;
		margin-right: 3px;
		display: none;
	}
	.inputCss{
		width:20;
	}
</style>
