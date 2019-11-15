const app=new Vue({
	el: '#app',
	data: {
		data:[],
		type:"",
		error:null,
		processes:[]
	},
	methods:{
		isnertProccess(){
			this.processes.push({arrive:"", birth:""})
			this.error=null;
		},
		deleteProccess(index){
  			this.processes.splice(index, 1);
		},
		simulate(){
			if (this.processes.length==0) {
				this.error="insert at least 1 process.";
				return;
			}
			this.data=[];
			for (var i = 0; i < this.processes.length; i++) {
				if (this.processes[i].arrive=="" || this.processes[i].birth=="") {
					this.error="Fill all field for all processes.";
					return;
				}
				this.data.push({arrive:parseInt(this.processes[i].arrive), birth:parseInt(this.processes[i].birth)});
			}
			this.error=null;
			switch(this.type){
				case "fcfs":
					app.simulateFCFS();
				break;
				case "sjf":
					simulateFJF();
				break;
				case "round-robin":
					simulateROUNDROBIN();
				break;
				default:
					this.error="select simulate type.";
					return;
			}
		},
		simulateFCFS(){
			this.data.sort(function compare( a, b ) {
			  if ( a.arrive < b.arrive ){
			    return -1;
			  }
			  if ( a.arrive > b.arrive ){
			    return 1;
			  }
			  return 0;
			});
			proccessedData=[
				{
					arrive: this.data[0].arrive,
					start:this.data[0].arrive,
					birth:this.data[0].birth,
					finish:(this.data[0].arrive+this.data[0].birth)
				}
			];
			for (var i = 1; i < this.data.length; i++) {
				singleProccess={};
				singleProccess.arrive=this.data[i].arrive;
				if (this.data[i].arrive<proccessedData[i-1].finish)
					singleProccess.start=proccessedData[i-1].finish;
				else
					singleProccess.start=this.data[i].arrive;
				singleProccess.birth=this.data[i].birth;
				singleProccess.finish=(singleProccess.start+singleProccess.birth);
				proccessedData.push(singleProccess);
			}
			console.log(proccessedData);

		},
		simulateFJF(){

		},
		simulateROUNDROBIN(){

		}
	}
});

