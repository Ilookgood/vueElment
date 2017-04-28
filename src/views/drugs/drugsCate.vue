<template>
	<section>
		<!--搜索-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getDrugsCates">查询</el-button>
				</el-form-item>
					<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>				
			</el-form>
		</el-col>
		
		<!--列表-->
		<el-table :data="drugscate" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="品牌名称" width="120" sortable>
			</el-table-column>		
			<el-table-column label="操作" width="150">
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
				<el-form-item label="类别名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>

	var baseUrl = 'http://www.test.api/api/';	
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				drugscate:[],
				start:0,
				length:10,
				total:0,
				pageSizes:[10,20,50,100],
				//新增
				addFormVisible: false,
				addLoading: false,				
						
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
		
			//获取类别
			getDrugsCates: function () {
				let para = {
					name: this.filters.name
				}
		
				this.$http.get(baseUrl+"drugcate?start="+ this.start + "&length="+this.length+"&name="+para.name).then(
				(res) => {			
				
					console.log(res);
					// 处理成功的结果                               
					this.total      = res.body.total		
					this.drugscate  = res.body.data			
			
				},(ere) => {
					
				}
              )
			},
			
			//新增
			handleAdd:function(){
				this.addFormVisible = true;
				this.addForm = {
                    name: '',
                };		    
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
                                    this.getDrugsCates();
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
                    let url=baseUrl+'drugcate'
                    this.$http.delete(url+'/'+para.id).then(
                        (res) => {
                            // 处理成功的结果
                            
							this.getDrugsCates();
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
			this.getDrugsCates();
		}
	}

</script>