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
			<!--<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>-->
			<el-table-column prop="name" label="门诊名称" width="120"  sortable>
			</el-table-column>
			<el-table-column prop="hospitalName" label="所属医院" width="120"  sortable>
			</el-table-column>
			<!--<el-table-column prop="is_enable"   label="是否可用" width="120" sortable>-->
			</el-table-column>
			<el-table-column prop="hospitalLevel" label="所属医院等级" width="150" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="联系电话" width="120" sortable>
			</el-table-column>
			<el-table-column prop="address" label="联系地址" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="fax" label="传真" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="is_enable" label="是否对外开放" min-width="180" sortable>
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
				<el-form-item label="门诊名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属医院" prop="hospital">
					<Search @searchname="searchname"></Search>
				</el-form-item>
				<el-form-item label="是否对外开放" prop="is_enable">
					<el-radio class="radio" v-model="editForm.is_enable" label="1" auto-complete="off">是</el-radio>
					<el-radio class="radio" v-model="editForm.is_enable" label="2" auto-complete="off">否</el-radio>
				</el-form-item>
				<el-form-item label="所属医院等级" prop="hospitalLevel">
					<el-select v-model="editForm.hospitalLevel" clearable placeholder="请选择">
						<el-option
								v-for="item in options"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系电话"  prop="phone">
					<!--	<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>-->
					<el-input type="number" placeholder="输入电话号码"  auto-complete="off" v-model="editForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="传真" prop="address" >
					<el-input type="textarea" v-model="editForm.fax"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系地址" prop="address" >
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
				<el-form-item label="门诊名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属医院" prop="hospitalName">
					<search @searchname="searchname"></search>
				</el-form-item>
				<el-form-item label="是否对外开放" prop="is_enable">
					<!--<el-input type="textarea" v-model="addForm.address"  auto-complete="off"></el-input>-->
					<el-radio class="radio" v-model="addForm.is_enable" label="1" auto-complete="off">是</el-radio>
					<el-radio class="radio" v-model="addForm.is_enable" label="2" auto-complete="off">否</el-radio>
				</el-form-item>
				<el-form-item label="医院等级" prop="hospitalLevel">
					<!--	<el-input v-model="addForm.level"  auto-complete="off"></el-input>-->
					<el-select v-model="addForm.hospitalLevel" clearable placeholder="请选择">
						<el-option
								v-for="item in options"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<!--<el-input type="number"   auto-complete="off" v-model="addForm.phone" class="inputCss"></el-input>-->
					<el-input type="number" placeholder="输入电话号码"  auto-complete="off" v-model="addForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="传真" prop="fax">
					<el-input type="text" v-model="addForm.fax"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系地址" prop="address">
					<el-input type="textarea" v-model="addForm.address"  auto-complete="off"></el-input>
				</el-form-item>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--工具条-->
		<!--<el-col :span="24" class="toolbar">
		&lt;!&ndash;	<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>&ndash;&gt;
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>-->
		<el-pagination v-bind:current-Page="start" v-bind:page-size="length" :total="total"
					   layout="total,sizes,prev,pager,next,jumper" v-bind:page-sizes="pageSizes"
					   v-on:size-change="sizeChange" v-on:current-change="pageIndexChange">
		</el-pagination>
	</section>
</template>
<script>

    import Search from './Search'
    import axios from 'axios';
    export default {
        components:{
            'Search':Search
        },
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
                is_enable: '',
                hospitaLevel:'',
                address:'',
                label:'',
                fax:'',
                total: 0,
                listLoading: false,
                phone:'152225522',
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
                    hospital: '',
                    fax:'',
                    is_enable: 0,
                    phone: '',
                    label:'',
                    address: ''
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
                    is_enable: '1',
                    hospital: '',
                    fax:'',
                    phone: '',
                    label:'',
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
                    page: this.page,
                    name: this.filters.name,
                    is_enable: this.is_enable,
                    phone: this.phone,
                    label: this.label,
                    hospitalName: this.hospitalName,
                    hospitalLevel:this.hospitalLevel,
                    fax:this.fax,
                };
                    this.$http.get("http://17p01d9617.iask.in/api/departments?start="+ this.start + "&length="+this.length+"&name="+para.name).then(
                        (res) => {
                            // 处理成功的结果
							  for (let i=0; i<res.body.data.length; i++){
							 if(res.body.data[i].is_enable==1){
							     console.log(res.body.data[i].is_enable)
                                 res.body.data[i].is_enable='是'
							 }else {
                                 res.body.data[i].is_enable='否'
                                 }
							 }
                            this.total = res.body.total;
                            this.users = res.body.data;
                            this.listLoading = false;
                        }, (ere) => {
                            // 处理失败的结果
                        }
                    )
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    let url='http://17p01d9617.iask.in/api/departments'
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
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            searchname:function(hospital){
                this.editForm.hospital=hospital
                this.addForm.hospital=hospital
			},
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    is_enable: '1',
                    hospital:'',
                    hospitalLevel:'',
                    fax:'',
                    label:'',
                    phone: '',
                    address: ''

                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            let jsonli = {'name':para.name,'is_enable':para.is_enable,'hospital':para.hospital,'fax':para.fax,'phone':para.phone,'address':para.address}
                            let url = 'http://17p01d9617.iask.in/api/departments';
                            this.$http.put(url+'/'+para.id,jsonli).then(
                                (res) => {
                                    // 处理成功的结果
                                    this.addLoading = true;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success',
                                    });
                                    this.editFormVisible = false;
									/*    this.$refs['addForm'].resetFields();*/
                                    this.getUsers();
                                },(ere) => {
                                    console.log(ere)
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
                            this.addLoading = true;
							/*	NProgress.start();*/
                            let para = Object.assign({}, this.addForm);
                            let jsonli = {'name':para.name,'is_enable':para.is_enable,'hospital':para.hospital,'hospitalLevel':para.hospitalLevel,'fax':para.fax,'phone':para.phone,'address':para.address}
                            this.$http.post("http://17p01d9617.iask.in/api/departments",jsonli,{emulateJSON: true}).then(
                                (res) => {
                                    // 处理成功的结果
                                    this.addLoading = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success',
                                    });
                                    this.editFormVisible = false;
									/*   this.$refs['addForm'].resetFields();*/
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