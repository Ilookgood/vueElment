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
			<el-table-column prop="email" label="邮箱" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="电话号码" sortable>
			</el-table-column>
			<!--<el-table-column prop="status" label="状态" sortable>
			</el-table-column>-->
			<el-table-column prop="in_number" label="身份证号" sortable>
			</el-table-column>
			<el-table-column prop="height" label="身高" sortable>
			</el-table-column>
			<el-table-column prop="weight" label="体重" sortable>
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
    import {PatientRequest} from '../../fetch/api';
	
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
                email:'',
                mobile:'',
                id_number:'',
				height:'',
				weight:'',
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
                    name: this.filters.username,
                    start:this.start,
                    length:this.length,
                    status: this.status,
                    email: this.email,
                    mobile: this.mobile,
                    id_number: this.id_number,
                    height: this.height,
                    weight: this.weight,
				};
                PatientRequest(para).then((res) => {
                    this.total = res.data.total;
                    this.brands = res.data.data;
                    this.listLoading = false;
                }).catch((err) => {console.log(err)})
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
