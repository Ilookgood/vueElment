<template>
	<section>
		<div id='code'></div>
		<canvas id="canvas"></canvas>

		<div class="block">
			<span class="wrapper">
			<el-button type="danger" @click="Returns">返回</el-button>
		  </span>
		</div>
	</section>
</template>
<script>
    import {QuickMark} from '../../fetch/api';
    import Vue from 'vue'
    import QRCode from 'qrcode'
    Vue.use(QRCode)
    export default {
        data() {
            return {
                codes:''
            }
        },
        methods: {
            Returns(){
              this.$router.back(-1)
			},
            useqrcode(){
                var canvas = document.getElementById('canvas')
				let para={'id':1,'type':0}
                QuickMark(para).then((res) => {
                    console.log(res.data);
                    console.log(res.data.data);
                    QRCode.toCanvas(canvas,res.data.data , function (error) {
                        if (error) console.error(error);
                        console.log('success!');
                    })
                }).catch((err) => {console.log(err)})
            }
        },
        mounted() {
        this.useqrcode();
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
	.wrapper{
		margin-left:50%;
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