new Vue({
	el: '#app',
	data: {
		processes:[]
	},
	methods:{
		isnertProccess(){
			this.processes.push({arrive:null, birth:null})
		},
		deleteProccess(index){
  			this.processes.splice(index, 1);
		}
	}
});