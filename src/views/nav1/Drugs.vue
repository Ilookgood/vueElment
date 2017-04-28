<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.brand_name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getBrand">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="brands" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="brand_name" label="品牌名称" width="120" sortable>
				</el-table-column>				
			</el-table>
		</template>
	</section>
</template>
<script>
	import { mapGetters } from 'vuex'
	import Search from './Search'
    import axios from 'axios';
	
	export default {
		data() {
			return {
				filters: {
					brand_name: ''
				},
				loading: false,
				users: [],
				brands:[],
				start:0,
				length:10,
			}
		
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			//获取用户列表
			getBrand: function () {
				let para = {
					brand_name: this.filters.brand_name
				};

	         	this.loading = true;			
				this.$http.get("http://www.test.api/api/brands?start="+ this.start + "&length="+this.length+"&name="+para.brand_name).then(
				(res) => {
					// 处理成功的结果                               
					this.total   = res.body.total		
					this.brands  = res.body.data
					this.loading = false;
				},(ere) => {
					// 处理失败的结果
					console.log(ere)
				}
              )
			}
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
