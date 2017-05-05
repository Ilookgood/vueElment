<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
				<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>-

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
			<el-table-column prop="cateName" label="药品分类" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="branName" label="药品品牌" min-width="120" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="药品名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="条形码" prop="sn_code">
					<el-input v-model="editForm.sn_code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="国药准字号" prop="batch_number">
					<el-input v-model="editForm.batch_number" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="药品状态" prop="status">
					<el-radio class="radio" v-model="editForm.status" label="上架" >上架</el-radio>
					<el-radio class="radio" v-model="editForm.status" label="下架" >下架</el-radio>
				</el-form-item>
				<el-form-item label="药品分类" prop="cate_id">
					<el-select v-model="editForm.cate_id" clearable placeholder="请选择">
						<el-option
								v-for="item in options"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="药品品牌" prop="brand_id">
					<el-select v-model="editForm.brand_id" clearable placeholder="请选择">
						<el-option
								v-for="item in option"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="单位" prop="unit">
					<el-input type="text" placeholder="片或者盒"  auto-complete="off" v-model="editForm.unit"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
			<div>{{editForm.status}}</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="药品名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="条形码" prop="sn_code">
					<el-input v-model="addForm.sn_code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="国药准字号" prop="batch_number">
					<el-input v-model="addForm.batch_number" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="药品状态" prop="status">
					<el-radio class="radio" v-model="addForm.status" label="1" >上架</el-radio>
					<el-radio class="radio" v-model="addForm.status" label="2" >下架</el-radio>
				</el-form-item>
				<el-form-item label="药品分类" prop="cate_id">
					<el-select v-model="addForm.cate_id" clearable placeholder="请选择">
						<el-option
								v-for="item in options"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="药品品牌" prop="brand_id">
					<el-select v-model="addForm.brand_id" clearable placeholder="请选择">
						<el-option
								v-for="item in option"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="单位" prop="unit">
					<el-input type="text" placeholder="片或者盒"  auto-complete="off" v-model="addForm.unit"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<el-pagination v-bind:current-Page="start" v-bind:page-size="length" :total="total"
					   layout="total,sizes,prev,pager,next,jumper" v-bind:page-sizes="pageSizes"
					   v-on:size-change="sizeChange" v-on:current-change="pageIndexChange">

		</el-pagination>
	</section>
</template>

<script>

import NProgress from 'nprogress'
import axios from 'axios';
var baseUrl = 'http://www.test.api/api/';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
                options:[],
                option:[],
                sn_code:'',
                batch_number:'',
                status: '1',
                unit:'',
                cateName: '',
                branName: '',
				users: [],
                total: 0,
				listLoading: false,
				sels: [],//列表选中列
                start:0,
                length:10,
				pageSizes:[10,20,50,100],
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: '',
                    name: '',
                    sn_code: '',
                    batch_number: '',
                    status: '1',
                    unit: '',
                    cate_id:'',
                    brand_id:''
				},


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
                    level: [
                        { required: true, message: '', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '', trigger: 'blur' }
                    ]
				},
				//新增界面数据
				addForm: {
                    name: '',
                    sn_code: '',
                    batch_number: '',
                    status: '1',
                    unit: '',
                    cate_id:'',
                    brand_id:''
				}

			}
		},
		methods: {
                sizeChange: function (length) {
                    this.length = length;
                    console.log(this.length)
                    this.getUsers();
                },
                pageIndexChange: function (start) {
                    console.log(this.start)
                    this.start = start;
                    this.getUsers();
                },

			//获取用户列表
			getUsers() {
                let para = {
                    name: this.filters.name,
                    sn_code: this.sn_code,
                    batch_number:this.batch_number,
                    status: this.status,
                    unit:this.unit,
                    cateName: this.cateName,
                    branName: this.branName,
                };

             this.$http.get(baseUrl+"drugs?start="+ this.start + "&length="+this.length+"&name="+para.name).then(
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

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					let url=baseUrl+'drugs';
                    this.$http.delete(url+'/'+para.id).then(
                        (res) => {
                            // 处理成功的结果
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUsers();
                        },(ere) => {
                            console.log(ere)
                        }
                    )

				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
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
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    name: '',
                    sn_code: '',
                    batch_number: '',
                    status: '1',
                    unit: '',
					cate_id:'',
					brand_id:''
				};
                this.$http.get(baseUrl+"drugcate?").then(
                    (res) => {
                        this.options=[]
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
                        this.option=[]
                        for (let i=0; i<res.body.data.length; i++){
                            this.option.push({
                                value: res.body.data[i].id,
                                label: res.body.data[i].brand_name,
                            })

                        }
                    }
                )
			},
			//编辑
		editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = false;
                            if(this.editForm.status=="上架"){
                                this.editForm.status="1"
                            }else if(this.editForm.status=="下架"){
                                this.editForm.status="2"
                            }
							let para = Object.assign({}, this.editForm);
							console.log(para.cate_id)
                            console.log(para.brand_id)
                        let jsonli = {'name':para.name,'sn_code':para.sn_code,'batch_number':para.batch_number,'status':para.status,'unit':para.unit,'cate_id':para.cate_id,'brand_id':para.brand_id}
						let url = baseUrl+'drugs';
                           this.$http.put(url+'/'+para.id,jsonli).then(
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
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = false;
							let para = Object.assign({}, this.addForm);
                            this.$http.post(baseUrl+"drugs",{'name':para.name,'sn_code':para.sn_code,'batch_number':para.batch_number,'status':para.status,'unit':para.unit,'cate_id':para.cate_id,'brand_id':para.brand_id},{emulateJSON: true}).then(
                                (res) => {
                                    // 处理成功的结果
                                    this.addLoading = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success',
                                    });
                                    this.editFormVisible = false;
                                    this.$refs['addForm'].resetFields();
                                    this.getUsers();
                                },(ere) => {
                                }
                            )
						});
					}
				});
			},
			selsChange: function(sels) {
				this.sels = sels;
				console.log(this.sels )
			},
			//批量删除
	/*		batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}*/
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
		width:20;
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