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
			<el-table-column  label="订单号" width="120"  sortable>
			     <template scope="scope">
					 <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)">{{scope.row.order_sn}}</el-button>
				 </template>
			</el-table-column>

			<el-table-column prop="status"   label="订单状态" width="120" sortable>
			</el-table-column>
			<el-table-column prop="order_amount" label="订单金额" width="120" sortable>
			</el-table-column>
			<el-table-column prop="create_time" label="下单时间" width="180" sortable>
			</el-table-column>
			<el-table-column  label="患者名称" width="120" sortable>
				<template scope="scope">
					<el-button size="small" type="text" @click="handle(scope.$index, scope.row)">{{scope.row.patiens_name}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="patiens_phone" label="患者电话"  sortable>
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
				<el-form-item label="医院名称" prop="name">
					<el-input type="text" v-model="editForm.name" auto-complete="off" placeholder="输入医院名称"  ></el-input>
				</el-form-item>
				<el-form-item label="是否可用" >
					<el-radio class="radio" v-model="editForm.is_enable" label="是" >是</el-radio>
					<el-radio class="radio" v-model="editForm.is_enable" label="否" >否</el-radio>
				</el-form-item>
				<el-form-item label="医院等级" prop="level">
					<el-select v-model="editForm.level" clearable placeholder="请选择">
					<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="电话号码"  prop="phone">
					<el-input v-model="editForm.phone" type="tel" placeholder="输入电话号码"  auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="医院地址" prop="address" >
					<el-input type="textarea" v-model="editForm.address"  auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="医院名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否可用" prop="is_enable">
					<el-radio class="radio" v-model="addForm.is_enable" label="1" >是</el-radio>
					<el-radio class="radio" v-model="addForm.is_enable" label="2" >否</el-radio>
				</el-form-item>
				<el-form-item label="医院等级" prop="level">
					<el-select v-model="addForm.level" clearable placeholder="请选择">
						<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="电话号码" prop="phone">
					<el-input type="number" placeholder="输入电话号码"  auto-complete="off" v-model="addForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="医院地址" prop="address">
					<el-input type="textarea" v-model="addForm.address"  auto-complete="off"></el-input>
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
	import {RecipeRequestLogin,RecipeCompile,RecipeAdded,RecipeDelete} from '../../fetch/api';
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
                options: [{
                    value: '1',
                    label: '三甲A'
                }, {
                    value: '2',
                    label: '三甲C'
                }, {
                    value: '3',
                    label: '二甲A'
                }, {
                    value: '4',
                    label: '二甲C'
                }],
				users: [],
                is_enable: "1",
                total: 0,
                level: 1,
				listLoading: false,
                phone:'',
                label:'',
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
                    level: '',
                    is_enable:"",
                    phone: '',
                    address: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
                    level: [
                        { required: true, message: '请选择医院等级', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入电话号码', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入医院地址', trigger: 'blur' }
                    ]
				},
				//新增界面数据
				addForm: {
                    name: '',
                    is_enable: "1",
                    level: '',
                    phone: '',
                    address: ''
				}

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
                let para = {
                    name: this.filters.name,
                    start:this.start,
                    length:this.length,
                };
                RecipeRequestLogin(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.data;
                    this.listLoading = false;
                }).catch((err) => {console.log(err)})
            },

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = row.id ;
                  TableDelete(para).then((res) => {
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
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    name: '',
                    is_enable: '',
                    level: '',
                    phone: '',
                    address: ''
				};
			},
			//编辑
		editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = false;
							if(this.editForm.is_enable=="是"){
                                this.editForm.is_enable="1"
							}else {
                                this.editForm.is_enable="2"
							}
							let para = Object.assign({}, this.editForm)
                            let paral = {'id':para.id,'name':para.name,'is_enable':para.is_enable,'level':para.level,'phone':para.phone,'address':para.address}
                            TableCompile(paral).then(data => {
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
                            TableAdded(para).then(data => {
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
		width:20px;
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