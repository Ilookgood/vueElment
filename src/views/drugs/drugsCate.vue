<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getBrand">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="brands" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column prop="name" label="品牌名称" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150px">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--新增-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="品牌名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑--->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="品牌名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--工具条-->
		<el-pagination v-bind:current-Page="start" v-bind:page-size="length" :total="total"
					   layout="total,sizes,prev,pager,next,jumper" v-bind:page-sizes="pageSizes"
					   v-on:size-change="sizeChange" v-on:current-change="pageIndexChange">
		</el-pagination>



	</section>
</template>
<script>
    import moment from 'moment'
    import {BrandsRequest,BrandsAdded,BrandsCompile,BrandsDelete} from '../../fetch/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                loading: false,
                brands:[],
                start:0,
                length:10,
                total:0,
                pageSizes:[10,20,50,100],
                //新增
                addFormVisible: false,
                addLoading: false,
                //图片上传
                form: {},
                addForm:
                    {
                        name:'',
                    },
                addFormRules:{
                    name: [
                        {
                            required: true, message: '请输入品牌名称', trigger: 'blur' }
                    ],
                },
                //编辑
                editFormVisible:false,
                editLoading:false,
                editFormRules: {
                    name:
                        [
                            {
                                required: true, message: '请输入品牌名称', trigger: 'blur'
                            }
                        ],
                },
                editForm: {
                    name: '',
                },
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
                    name: this.filters.name,
                    start:this.start,
                    length:this.length
                };
                this.loading = true;
                BrandsRequest(para).then((res) => {
                    this.total = res.data.total;
                    this.brands = res.data.data;
                    this.loading = false;
                }).catch((err) => {console.log(err)})
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            handleAdd:function(){
                this.addFormVisible = true;
                this.addForm = {
                    name: ''
                };
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = Object.assign({}, this.addForm);
                            BrandsAdded(para).then(data => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                });
                                this.addFormVisible = false;
                                this.getBrand();

                            });
                        });
                    }
                });
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = Object.assign({}, this.editForm);
                            let jsonli = {'id':para.id,'name':para.name}
                            BrandsCompile(jsonli).then(data => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                });
                                this.editFormVisible = false;
                                this.getBrand();
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
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para =row.id ;
                    BrandsDelete(para).then((res) => {
                        this.listLoading = false;

                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getBrand();
                    }).catch((err) => {console.log(err)})

                }).catch(() => {

                });
            },
        },

        mounted() {
            this.getBrand();
        }

    };
</script>
<style >
	.el-dialog .el-dialog__body .el-form.el-form-item.is-required .el-form-item__label:before {
		content: '*';
		color: #ff4949;
		margin-right: 3px;
		display: none;
	}
	.el-upload-list__item-status-label{
		position: absolute;
		right: 5px;
		top: 0;
		line-height: inherit;
		display: block!important;
	}
	.inputCss{
		width:20;
	}
</style>
