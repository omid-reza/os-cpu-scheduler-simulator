var chart = document.getElementById('chart').getContext('2d');
const app=new Vue({
	el: '#app',
	data: {
		data:[],
		type:"",
		labels:[],
		error:null,
		processes:[],
		chartData:[],
		chartBorderColors:[],
		chartBackGroundColors:[]
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
				this.data.push({arrive:parseInt(this.processes[i].arrive), birth:parseInt(this.processes[i].birth), index:i});
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
					index:this.data[0].index,
					arrive: this.data[0].arrive,
					start:this.data[0].arrive,
					birth:this.data[0].birth,
					finish:(this.data[0].arrive+this.data[0].birth)
				}
			];
			this.labels=[];
			this.labels.push("process"+(this.data[0].index+1));
			this.borderColor=[];
			this.backgroundColor=[];
			borderColor=[
			                'rgba(255, 99, 132, 1)',
			                'rgba(54, 162, 235, 1)',
			                'rgba(255, 206, 86, 1)',
			                'rgba(75, 192, 192, 1)',
			                'rgba(153, 102, 255, 1)',
			                'rgba(255, 159, 64, 1)'
			            ];
			backgroundColor=[
			                'rgba(255, 99, 132, 0.2)',
			                'rgba(54, 162, 235, 0.2)',
			                'rgba(255, 206, 86, 0.2)',
			                'rgba(75, 192, 192, 0.2)',
			                'rgba(153, 102, 255, 0.2)',
			                'rgba(255, 159, 64, 0.2)'];
			this.borderColor[0]=[borderColor[0]];
			this.backgroundColor[0]=[backgroundColor[0]];
			for (var i = 1; i < this.data.length; i++) {
				this.labels.push("process "+(this.data[i].index+1));
				this.borderColor.push(borderColor[i%6]);
				this.backgroundColor.push(backgroundColor[i%6]);
				singleProccess={};
				singleProccess.index=this.data[i].index;
				singleProccess.arrive=this.data[i].arrive;
				singleProccess.birth=this.data[i].birth;
				if (this.data[i].arrive<proccessedData[i-1].finish)
					singleProccess.start=proccessedData[i-1].finish;
				else
					singleProccess.start=this.data[i].arrive;
				singleProccess.finish=(singleProccess.start+singleProccess.birth);
				proccessedData.push(singleProccess);
			}
			this.chartData=[];
			for (var i = 0; i < proccessedData.length; i++) {
				this.chartData.push([proccessedData[i].start,proccessedData[i].finish]);
			}
			app.showChart();
		},
		simulateFJF(){

		},
		simulateROUNDROBIN(){

		},
		showChart(){
			var myChart = new Chart(chart, {
			    type: 'horizontalBar',
			    data: {
			        labels: this.labels,
			        datasets: [{
			        	label: 'processes',
			            data: this.chartData,
			            borderColor: this.borderColor,
			            backgroundColor:this.backgroundColor,
			            borderWidth: 2
			        }]
			    },
			    options: {
			        scales: {
			            xAxes: [{
			                ticks: {
			                    beginAtZero: true
			                }
			            }]
			        },
					legend: {
						display: false
                    }
			    }
			});
		}
	}
});
