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
				<el-form-item>
					<el-button type="primary" @click="LevelProxyGeneration">一级代理生成</el-button>
				</el-form-item>
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
			<el-table-column label="指派" width="150px">
				<template scope="scope">
				<div  size="small" class="Anrik" @click="handleEdit(scope.$index, scope.row)">药品授权</div>
				<div size="small" class="Anrik" @click="handleDel(scope.$index, scope.row)">取消授权</div>
			</template>
		</el-table-column>
		</el-table>

		<!--编辑--->

		<!--工具条-->
		<el-pagination v-bind:current-Page="start" v-bind:page-size="length" :total="total"
					   layout="total,sizes,prev,pager,next,jumper" v-bind:page-sizes="pageSizes"
					   v-on:size-change="sizeChange" v-on:current-change="pageIndexChange">
		</el-pagination>
		
		
		
	</section>
</template>
<script>
    import {HomeRequest} from '../../fetch/api';
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
                console.log(this.start)
                this.getBrand();
            },

			
			//获取用户列表
			getBrand: function () {
				let para = {
                    name: this.filters.username,
                    start:this.start,
                    length:this.length,
                    status:this.status,
                    phone: this.phone,
                    real_name: this.real_name,
                    id_number: this.id_number
				};
	         	this.loading = true;
                HomeRequest(para).then((res) => {
                    console.log(res.data.data)
                    for (let i=0; i<res.data.data.length; i++){
                        if(res.data.data[i].is_enable==1){
                            res.data.data[i].is_enable='可用'
                        }else {
                            res.data.data[i].is_enable='不可用'
                        }
                    }
                    this.total = res.data.total;
                    this.brands = res.data.data;
                    this.loading = false;
                }).catch((err) => {console.log(err)})
			},
            handleEdit: function (index, row) {
				const user_id=row.id;
				let start=this.start;
				console.log(start)
                this.$router.push(`/Druglicenselist?user_type=1&user_id=${user_id}&start=${start}`)
            },
			//删除
            handleDel: function (index, row) {
                const user_id=row.id;
                let start=this.start;
                this.$router.push(`/Deauthorize?user_type=1&user_id=${user_id}&start=${start}`)
            },
			/*跳二维码*/
            LevelProxyGeneration(){
                this.$router.push(`/QrCode`)
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
	.Anrik{
          cursor: pointer;
	}
	.Anrik:hover{
		color: red;
	}
</style>
