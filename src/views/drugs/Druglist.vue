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
			<el-table-column prop="cateName" label="药品品牌" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="branName" label="药品分类" min-width="120" sortable>
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
				<el-form-item label="药品品牌" prop="cate_id">
					<el-select v-model="editForm.cate_id" clearable placeholder="请选择">
						<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="药品分类" prop="brand_id">
					<el-select v-model="editForm.brand_id" clearable placeholder="请选择">
						<el-option
								v-for="item in option"
								:key="item.value"
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
			<el-upload
					class="upload-demo"
					action="http://up-z2.qiniu.com"
					type="drag"
					:on-success="handleSuccess"
					:multiple="true"
					:before-upload="beforeUpload"
					:on-error="handleError"
					:data="form">
				<el-button size="small"  type="primary">点击上传</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
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
				<el-form-item label="药品品牌" prop="cate_id">
					<el-select v-model="addForm.cate_id" clearable placeholder="请选择">
						<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="药品分类" prop="brand_id">
					<el-select v-model="addForm.brand_id" clearable placeholder="请选择">
						<el-option
								v-for="item in option"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="单位" prop="unit">
					<el-input type="text" placeholder="片或者盒"  auto-complete="off" v-model="addForm.unit"></el-input>
				</el-form-item>
				<el-form-item label="" prop="image_url">
				<el-upload
						class="upload-demo"
						action="http://up-z2.qiniu.com"
						type="drag"
						:on-success="handleSuccessAdd"
						:multiple="true"
						:before-upload="beforeUpload"
						:on-error="handleError"
						:data="form">
					<el-button size="small"  type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
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
import moment from 'moment'
import percolate from '../../fetch/percolate'
import Dictionary from '../../fetch/Dictionary'
import {DruglistRequestLogin,DruglistCompile,DruglistAdded,DruglistDelete,drugsCateRequest,BrandsRequest,ImagesRequest} from '../../fetch/api';
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
                //图片上传
                form: {},
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
                    brand_id:'',
                    image_url:""

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
                    brand_id:'',
                    image_url:""

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
                    start: this.start,
                    length:this.length,
                };
                DruglistRequestLogin(para).then((res) => {
                    for (let i=0; i<res.data.data.length; i++){
                        res.data.data[i].status=percolate.getNameByCode(res.data.data[i].status,Dictionary.Drug)
                    }
                    this.total = res.data.total;
                    this.users = res.data.data;
                    this.listLoading = false;
                }).catch((err) => {console.log(err)})
            },
            handleError(err, response, file) {
                if (err.status === 401) {
                    this.$message.error('图片上传失败，请求中未附带Token')
                } else if(err.status === 614)
                {
                    this.$message.error('图片已经存在')
                }else {
                    this.$message.error(JSON.stringify(err))
                }
            },
            beforeUpload(file) {
                let curr = moment().format('YYYYMMDD').toString()
                let prefix = moment(file.lastModified).format('HHmmss').toString();
                let index1=file.name.lastIndexOf(".")
                let index2=file.name.length;
                let suffix1=file.name.substring(index1,index2);
                let key = encodeURI(`${curr}/${prefix}_${suffix1}`);
               return ImagesRequest(key).then((response) => {
                    this.upToken = response.data.token
                    this.key = key;
                    this.form = {
                        key,
                        token: this.upToken
                    }
                })
            },
            handleSuccess(response, file, fileList) {
                let key = response.key;
                let name = file.name;
                this.editForm.image_url=key;
                console.log(this.addForm.image_url)
            },
            handleSuccessAdd(response, file, fileList) {
                let key = response.key;
                let name = file.name;
                this.addForm.image_url=key;
                console.log(this.addForm.image_url)
            },
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para =  row.id;
                    DruglistDelete(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    }).catch((err) => {console.log(err)})

				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
				BrandsRequest().then((res) => {
                    this.options=[];
                    for (let i=0; i<res.data.data.length; i++){
                        this.options.push({
                            value: res.data.data[i].id,
                            label: res.data.data[i].name,
                        })
                    }

                })

                drugsCateRequest().then((res) => {
                    this.option=[];
                    for (let i=0; i<res.data.data.length; i++){
                        this.option.push({
                            value: res.data.data[i].id,
                            label: res.data.data[i].brand_name,

                        })
						console.log(this.option)
                    }

                })

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
					brand_id:'',
                    image_url:""
				};
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
                        let jsonli = {'id':para.id,'name':para.name,'sn_code':para.sn_code,'batch_number':para.batch_number,'status':para.status,'unit':para.unit,'cate_id':para.cate_id,'brand_id':para.brand_id,image_url:para.image_url}
                          DruglistCompile(jsonli).then(data => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                });
                                this.editFormVisible = false;
                                this.getUsers();
                            },(error=>{
                                this.$message({
                                    message: '请检查提交内容是否完整',
                                    type: 'error',
                                });

                            }))
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
                            DruglistAdded(para).then(data => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                });
                                this.addFormVisible = false;
                                this.$refs['addForm'].resetFields();
                                this.getUsers();
                            });
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