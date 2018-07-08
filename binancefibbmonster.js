const tw = require('./trendyways.js');
var MongoClient = require('mongodb').MongoClient;
					var bestAsk = []

				var plstart = -0.15178285;

				var bestBid = []
const Binance = require('node-binance-api')

const express = require('express');
var startDate = new Date()
var favicon = require('serve-favicon')
var path = require('path')
 var startBtc = 0.00360557 ; //0.00796575 
 var startBch = 0.06579248;
var app = express()
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
	function sortFunction3(a,b){  
				var dateA = new Date(a.datetime).getTime();
				var dateB = new Date(b.datetime).getTime();
				return dateA < dateB ? 1 : -1;  
			}; 
var dorefresh = false;
var request = require("request")
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
var sList = []
var gobuy = [];
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));
console.log(process.env.key);
var binance = new Binance().options({
  APIKEY: process.env.key,
  APISECRET: process.env.secret,
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  test: true // If you want to use sandbox mode where orders are simulated
});
var startDate = new Date();

var keys = []
var keys2 = []
//minQty = minimum order quantity
//minNotional = minimum order value (price * quantity)
	let minimums = {};
binance.exchangeInfo(function(error, data) {
	for ( let obj of data.symbols ) {
		let filters = {status: obj.status};
		for ( let filter of obj.filters ) {
			if ( filter.filterType == "MIN_NOTIONAL" ) {
				filters.minNotional = filter.minNotional;
			} else if ( filter.filterType == "PRICE_FILTER" ) {
				filters.minPrice = filter.minPrice;
				filters.maxPrice = filter.maxPrice;
				filters.tickSize = filter.tickSize;
			} else if ( filter.filterType == "LOT_SIZE" ) {
				filters.stepSize = filter.stepSize;
				filters.minQty = filter.minQty;
				filters.maxQty = filter.maxQty;
			}
		}
		//filters.baseAssetPrecision = obj.baseAssetPrecision;
		//filters.quoteAssetPrecision = obj.quoteAssetPrecision;
		filters.orderTypes = obj.orderTypes;
		filters.icebergAllowed = obj.icebergAllowed;
		minimums[obj.symbol] = filters;
	}
	global.filters = minimums;
	//fs.writeFile("minimums.json", JSON.stringify(minimums, null, 4), function(err){});
});

binance.websockets.miniTicker(markets => {
 // console.log(markets);
})
var volKs = []
var volTot = 0
var winners = []
var winnas = []
var tickers = []
var tickercount = []
binance.websockets.prevDay(false, (error, response) => {
  if (tickercount[response.symbol] == undefined){
		tickercount[response.symbol] = 0;
	}
	tickercount[response.symbol]++;
	
	if (btcusd != 0&& ethbtc != 0 && bnbbtc != 0){
		
	if (response.symbol.slice(-4)== "USDT"){
						var amt = parseFloat( btcusd );

					if (!volKs.includes(response.symbol) && ((parseFloat(response.quoteVolume) * parseFloat(response.bestAsk)) / amt)){						
					volKs.push(response.symbol);
						volTot += (parseFloat(response.quoteVolume) * parseFloat(response.bestAsk)) / amt;
					}
					}
					else if (response.symbol.slice(-3)== "ETH"){
						var amt = parseFloat(ethbtc);
					if (!volKs.includes(response.symbol) && ((parseFloat(response.quoteVolume) * parseFloat(response.bestAsk)) / amt)){						
	
					volKs.push(response.symbol);
						volTot += (parseFloat(response.quoteVolume) * parseFloat(response.bestAsk)) * amt;
					}
					}
					else if (response.symbol.slice(-3)== "BTC"){
						var amt = 1;
					if (!volKs.includes(response.symbol) && ((parseFloat(response.quoteVolume) * parseFloat(response.bestAsk)) / amt)){						

					volKs.push(response.symbol);
						volTot += (parseFloat(response.quoteVolume) * parseFloat(response.bestAsk)) / amt;
					}
					}
					else if (response.symbol.slice(-3)== "BNB"){
						var amt = parseFloat(bnbbtc)
					if (!volKs.includes(response.symbol) && ((parseFloat(response.quoteVolume) * parseFloat(response.bestAsk)) / amt)){						

					volKs.push(response.symbol);
						volTot += (parseFloat(response.quoteVolume) * parseFloat(response.bestAsk)) * amt;
					}
					}
					var avg = volTot / volKs.length;
					if ((parseFloat(response.quoteVolume) * parseFloat(response.bestAsk)) / amt > (avg / 5)){
						
						if (!tickers.includes(response.symbol)){
							//console.log(response.symbol);
						tickers.push(response.symbol)
						}
						bestAsk[response.symbol] = parseFloat(response.bestAsk);
						bestBid[response.symbol] = parseFloat(response.bestBid);
						avg = ((parseFloat(response['high']) + parseFloat(response['low'])) / 2);
						
						if (parseFloat(response.close) <= avg){
							var trend = 'DOWNTREND';
						}else {
							var trend = 'UPTREND';
						}
						var sfibb = [];
						 sfibb.push({
							h: parseFloat(response['high']),
							l: parseFloat(response['low'])
						})
							var f = fibonacciRetrs(sfibb, trend)[0];
							var lesser = []
							var greater = []
							for (var fibb in f){
									if (f[fibb] <= parseFloat(response.close)){
										lesser.push(f[fibb]);
									}
									else {
										greater.push(f[fibb]);
									}
							}
							winners[response.symbol] = {}
							if ((greater.length >= 1 && lesser.length >= 1)){
								
								var collection = dbo.collection(response.symbol);
								if (greater[0] != undefined){
									winners[response.symbol].sell1 = greater[0]
								}
								if (greater[1] != undefined){
									winners[response.symbol].sell2 = greater[1]
									
								}
								if (lesser[0] != undefined){
									winners[response.symbol].buy1 = lesser[0]
									winners[response.symbol].sl = lesser[0] * 0.01; //0.93
									
								}
								if (lesser[1] != undefined){
									winners[response.symbol].buy2 = lesser[1]
									winners[response.symbol].sl = lesser[1] * 0.01; //.93
									
								}
								    
								winners[response.symbol].bought1 = false;
								winners[response.symbol].bought2 = false;
								winners[response.symbol].sold1 = false;
								winners[response.symbol].sold2 = false;
								winners[response.symbol].k = response.symbol;
								winners[response.symbol].currencyPair = response.symbol;
								
								
								winners[response.symbol].cancelled = false;
								collection.find({

								}, {
								}).sort({
									_id: -1

								}).toArray(function(err, doc3) {
									if (doc3.length == 0){
									if (!winnas.includes(response.symbol)){
										winnas.push(response.symbol);
															
									
							insert(winners[response.symbol], collection);
									}
									}
									});
									if (tickercount[response.symbol] >= 75){
									updateStoplimits(winners[response.symbol], collection);
									tickercount[response.symbol]=0;
								}
								
							}
								
					}
	} else {
		if (response.symbol == "BTCUSDT"){
			btcusd = parseFloat(response.bestAsk);
			console.log(btcusd)
		}
		else if (response.symbol == "ETHBTC"){
			ethbtc = parseFloat(response.bestAsk);
			console.log(ethbtc)
		}
		else if (response.symbol == "BNBBTC"){
			bnbbtc = parseFloat(response.bestAsk);
			console.log(bnbbtc)
		}
	}
});
var btcusd = 0
var bnbbtc = 0
var ethbtc = 0

	function updateStoplimits(wp, collection){
		if (wp.k == 'tXMRBTC'){
		console.log(wp);
		}

		collection.find({

                }, {
                    $exists: true
                }).sort({
                    _id: -1

                }).toArray(function(err, doc3) {
                    for (var d in doc3) {
						if (doc3[d].trades){
							doc3[d].trades.buy1 = wp.buy1;
							doc3[d].trades.buy2 = wp.buy2;
							doc3[d].trades.sell1 = wp.sell1;
							doc3[d].trades.sell2 = wp.sell2;
							
	 collection.update({
	},{
                            $set: {
                                'trades': doc3[d].trades
                            }
                        }, {
		
	},
	function(err, result) {
	
		//console.log(result.result);
	});
	}
					}
					});
				}
			setTimeout(function(){
MongoClient.connect(process.env.mongodb || mongodb, function(err, db) {
	
    var dbo = db.db(process.env.thedatabase)
	var count = 0;
    dbo.listCollections().toArray(function(err, collInfos) {
        // collInfos is an array of collection info objects that look like:
        // { name: 'test', options: {} }
        for (col in collInfos) {

            dbs.push(collInfos[col].name);
            collections.push(dbo.collection(collInfos[col].name));
        }
        //////////console.log(dbs);
						////////////console.log('settimeout');
						doCollections(collections);
                setInterval(function() {
                    doCollections(collections);
                }, 25500);
    });
});
}, 10000);

function sortFunction(a,b){  
	var dateA = (a.percent);
	var dateB = (b.percent);
	return dateA > dateB ? 1 : -1;  
}; 
	function sortFunction3(a,b){  
				var dateA = new Date(a.time).getTime();
				var dateB = new Date(b.time).getTime();
				return dateA < dateB ? 1 : -1;  
			}; 


var dbs = []
var collections = []
var trades  = []
	setInterval(function(){
		binance.balance((error, balances) => {
  for (var v in balances){
	  if (parseFloat(balances[v].available) != 0){
		  console.log(v)
		  console.log(balances[v])
		  
	  }
  }
		});
	}, 120000);
	var stoplimits = []
	var orders = []
	app.get('/', function(req,res){
		orders = []
		stoplimits = []
		msg = '<meta http-equiv="refresh" content="120"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script></head><h1>Don\'t Panic! If the values seem off, wait a minute or two.</h1>'
		binance.balance((error, balances) => {
		msg+="USDT bal: " + balances.USDT.available
		msg+=" USDT begin bal: " + process.env.usdtstart
		msg+="<br>ETH bal: " + balances.ETH.available
		msg+=" ETH begin bal: " + process.env.ethstart
		msg+="<br>BTC bal: " + balances.BTC.available	
		msg+=" BTC begin bal: " + process.env.btcstart
		msg+="<br>BNB bal: " + balances.BNB.available
		msg+=" BNB begin bal: " + process.env.bnbstart
		dbo.listCollections().toArray(function(err, collInfos) {
		// collInfos is an array of collection info objects that look like:
		// { name: 'test', options: {} }
		for (col in collInfos) {

			dbs.push(collInfos[col].name);
			collections.push(dbo.collection(collInfos[col].name));
		}
		//////////console.log(dbs);				
		////console.log(tickers);
binance.openOrders(false, (error, openOrders) => {
  for (var o in  openOrders){
	  orders.push(openOrders[o])
  }
});
trades = []
binance.allOrders("ETHBTC", (error, orders, symbol) => {
	for (var o in orders){
		if (orders[o].status != "ACTIVE"){
			trades.push(orders[o])
		}
	}
  console.log(symbol+" orders:", orders);
});
		for (var c in collections){
			var collection = collections[c];
				collection.find({

				}, {
					$exists: true
				}).sort({
					_id: -1

				}).toArray(async function(err, doc3) {
					var thecount = 0
					for (var d in doc3){
					//	////////console.log(doc3[d])
						
						//////////console.log(doc3[d].trades);
						if (doc3[d].trades){
							
						if (doc3[d].trades.bought1 == false){
							var sl = {'direction': 'buy1', 'pair' : doc3[d].trades.k, 'stoplimit': doc3[d].trades.buy1, 'currentAsk': bestAsk[doc3[d].trades.k], 'percent': (parseFloat(bestAsk[doc3[d].trades.k]) / parseFloat(doc3[d].trades.buy1))}
						if (tickers.includes(doc3[d].trades.k)){
						stoplimits.push(sl);
							
						}
						}
						if (doc3[d].trades.bought2 == false){
							if (doc3[d].trades.buy2 != undefined){
							//console.log(bestAsk);
							var sl = {'direction': 'buy2', 'pair' : doc3[d].trades.k, 'stoplimit': doc3[d].trades.buy2, 'currentAsk': bestAsk[doc3[d].trades.k], 'percent': (parseFloat(bestAsk[doc3[d].trades.k]) / parseFloat(doc3[d].trades.buy2))}
							
if (tickers.includes(doc3[d].trades.k)){
						stoplimits.push(sl);
							
						}								
							}
						}
						}
						
					}
		});
						}
					setTimeout(function(){
						orders.sort(sortFunction3);
						trades.sort(sortFunction3);
							stoplimits.sort(sortFunction);
						msg+='<br>stoplimits:<div id="showData"></div><br>'
						msg+='<br>open orders: (' + orders.length + ')'
						msg+='<div id="showData2"></div><br>closed orders: (' + trades.length + ')'
						msg+='<div id="showData3"></div>'
						msg+='<div style="display:none;" id="stoplimits">' + JSON.stringify(stoplimits) + '</div>'
						msg+='<div style="display:none;" id="orders2">' + JSON.stringify(orders) + '</div>'
						msg+= '<div style="display:none;" id="trades">' + JSON.stringify(trades) + '</div>'
						msg+='<script>'
						msg+='for(var col=[],i=0;i<JSON.parse($("#orders2").text()).length;i++)for(var key in JSON.parse($("#orders2").text())[i])-1===col.indexOf(key)&&col.push(key);var table3=document.createElement("table");for(tr=table3.insertRow(-1),i=0;i<col.length;i++){(th=document.createElement("th")).innerHTML=col[i],tr.appendChild(th)}for(i=0;i<JSON.parse($("#orders2").text()).length;i++){tr=table3.insertRow(-1);for(var j=0;j<col.length;j++){(tabCell=tr.insertCell(-1)).innerHTML=JSON.parse($("#orders2").text())[i][col[j]]}}var divContainer3=document.getElementById("showData2");divContainer3.innerHTML="",divContainer3.appendChild(table3);'
						msg+='for(col=[],i=0;i<JSON.parse($("#trades").text()).length;i++)for(var key in JSON.parse($("#trades").text())[i])-1===col.indexOf(key)&&col.push(key);var table4=document.createElement("table");for(tr=table4.insertRow(-1),i=0;i<col.length;i++){var th;(th=document.createElement("th")).innerHTML=col[i],tr.appendChild(th)}for(i=0;i<JSON.parse($("#trades").text()).length;i++){tr=table4.insertRow(-1);for(j=0;j<col.length;j++){var tabCell;(tabCell=tr.insertCell(-1)).innerHTML=JSON.parse($("#trades").text())[i][col[j]]}}var divContainer4=document.getElementById("showData3");divContainer4.innerHTML="",divContainer4.appendChild(table4);'
						msg+= 'for(var col=[],i=0;i<JSON.parse($("#stoplimits").text()).length;i++)for(var key in JSON.parse($("#stoplimits").text())[i])-1===col.indexOf(key)&&col.push(key);var table2=document.createElement("table");for(tr=table2.insertRow(-1),i=0;i<col.length;i++){var th=document.createElement("th");th.innerHTML=col[i],tr.appendChild(th)}for(i=0;i<JSON.parse($("#stoplimits").text()).length;i++){tr=table2.insertRow(-1);for(var j=0;j<col.length;j++){var tabCell=tr.insertCell(-1);tabCell.innerHTML=JSON.parse($("#stoplimits").text())[i][col[j]]}}var divContainer2=document.getElementById("showData");divContainer2.innerHTML="",divContainer2.appendChild(table2);'
						msg+='</script>'
						res.send(msg);
					}, 2000);
		});
	})
	})
function buy(k, rate, rate2){ //rate2 for buy is higher
console.log('buying ' + k + ' ' + rate + ' ' + rate2);
binance.balance((error, balances) => {
  var amount = 0
  if (k.slice(-4)=="USDT"){
amount = balances.USDT.available / 10 	   
  }else if (k.slice(-3)=="ETH"){
amount = balances.ETH.available / 10
	  
	  
  }else if (k.slice(-3)=="BTC"){
amount = balances.BTC.available / 10
	  
	  
  }else if (k.slice(-3)=="BNB"){
amount = balances.BNB.available / 10
	  
	  
  }
  amount = amount / rate
  
	  // Set minimum order amount with minQty
	  if ( amount < minimums[k].minQty ) amount = minimums[k].minQty;

// Set minimum order amount with minNotional
if ( rate * amount < minimums[k].minNotional ) {
	amount = minimums[k].minNotional / rate;
}

// Round to stepSize
amount = binance.roundStep(amount, minimums[k].stepSize);


var amount2 = amount
	  // Set minimum order amount with minQty
	  if ( amount2 < minimums[k].minQty ) amount2 = minimums[k].minQty;

// Set minimum order amount with minNotional
if ( rate2 * amount2 < minimums[k].minNotional ) {
	amount2 = minimums[k].minNotional / rate2;
}

// Round to stepSize
amount2 = binance.roundStep(amount2, minimums[k].stepSize);
  console.log(k)
  console.log(amount)
  console.log(rate)
  console.log(rate2)
binance.buy(k, amount, rate, {type:'LIMIT'}, (error, response) => {
  console.log("Limit Buy response", response);
  console.log("order id: " + response.orderId);
  binance.sell(k, amount2, rate2, {type:'LIMIT'}, (error, response) => {
  console.log("Limit Sell response", response);
  console.log("order id: " + response.orderId);
});

});

});

}
            app.listen(process.env.PORT || 8080, function() {});
					
function doCollections(collections, balances){
							
							
						//////console.log('8'); 
			
    
			
            //////////console.log(balances.BTC);
			
			var count = 0;
							
            for (var c in collections) {
                var collection = collections[c];
                collectionDo(collection);



							}
        
}
var godobuy = true;
var godosell = true;
 async function collectionDo(collection){
							var ds = []

	collection.find({

                }, {
                    $exists: true
                }).sort({
                    _id: -1

                }).toArray(function(err, doc3) {

                    for (var d in doc3) {
						if (doc3[d].trades){
							 var d3d = doc3[d];	
							if (d3d.trades.currencyPair){
								if (d3d.trades.bought1 == true && d3d.trades.bought2 == true && ((d3d.trades.buyorder1 == 0) &&((d3d.trades.buyorder2 == 0)))){
									if (d3d.trades.bought1 == true){
									////console.log('bought1 and bought2 true');
								} 
								activeOrders[d3d.trades.k] = activeOrders[d3d.trades.k] - 1
									d3d.trades.bought1 = false;
									d3d.trades.bought2 = false;
									d3d.trades.buyorder1 = 0;
									d3d.trades.buyorder2 = 0;
									collection.update({
									}, {
										$set: {
											"trades": d3d.trades
										}
									}, { multi: true },
									function(err, result) {
									   
										//////console.log(result.result);
															

									});
								
								} 
								
								if (d3d.trades.sold1 == true && d3d.trades.sold2 == true && ((d3d.trades.sellorder1 == 0 ) &&((d3d.trades.sellorder2 == 0 )))){
									if (d3d.trades.sold1 == true){
									////console.log('sold1 and sold2 true');
								}
								activeOrders[d3d.trades.k] = activeOrders[d3d.trades.k] - 1
									d3d.trades.sold1 = false;
									d3d.trades.sold2 = false;
									collection.update({
									}, {
										$set: {
											"trades": d3d.trades
										}
									}, { multi: true },
									function(err, result) {
									   
										//////console.log(result.result);
															

									});
								}
								}
								}
								if (d3d.trades.currencyPair == 'XZCBNB' || d3d.trades.currencyPair == 'NASBNB'){
							console.log(d3d)
							console.log(bestAsk[d3d.trades.k])
							console.log(d3d.trades.buy1 * .99);
								}
						if (d3d.trades.bought1 == false){
							
                        if (parseFloat(bestAsk[d3d.trades.k]) <= (d3d.trades.buy1 * 1.001)  )	 {
                            //////////console.log(d3d.trades.last);
							//////////console.log(d3d.trades);
							d3d.trades.bought1 = true;
							if (godobuy == true){
								godobuy = false;

							console.log('dobuy:');
							////console.log(d3d);
							collection.update({
								}, {
									$set: {
										"trades": d3d.trades
									}
								}, { multi: true },
								function(err, result) {
								   
									//////console.log(result.result);
														

								});
							buy(d3d.trades.k, d3d.trades.sell1, d3d.trades.buy1);
							}
                        }
						}
                        if (d3d.trades.buy2) {
                            if (parseFloat(bestAsk[d3d.trades.k])<= (d3d.trades.buy2 * 1.001) && d3d.trades.bought2 == false  ) {
							//////////console.log(d3d.trades.last);
							//////////console.log(d3d.trades);
							d3d.trades.bought2 = true;
														if (godobuy == true){
godobuy = false;
								collection.update({
								}, {
									$set: {
										"trades": d3d.trades
									}
								}, { multi: true },
								function(err, result) {
								   
									//////console.log(result.result);
														

								});
							console.log('dobuy2:');
							buy(d3d.trades.k, d3d.trades.buy2, d3d.trades.buy1);
                            }
							}
                        }
						if (d3d.trades.k == 'tSNTUSD'){
						//console.log(d3d.trades.k);
						//console.log(d3d.trades.sold1);
						//console.log(parseFloat(bestBid[d3d.trades.k]))
						//console.log(d3d.trades.sell1);
						}
					}
						})
				}
					
 function insert(wp, collection){
	//console.log(wp);
	
			collection.find({

                }, {
                    $exists: true
                }).sort({
                    _id: -1

                }).toArray(function(err, doc3) {
					console.log(err);
					if (doc3 != undefined){
					if (doc3.length == 0){
	 console.log('insert');
						collection.insertOne({
				'trades': wp
			}, function(err, res) {
				if (err) 
				
			if (wp.currencyPair == "BTC_BCH"){
				////////console.log(wp);
			}
			  //////console.log(res.result);
			}); 
					}
					} 	else {
 console.log('insert');
						collection.insertOne({
				'trades': wp
			}, function(err, res) {
				if (err) 
				
			if (wp.currencyPair == "BTC_BCH"){
				////////console.log(wp);
			}
			  //////console.log(res.result);
			}); 
					}					
				})
			
 }
var dbo;
				MongoClient.connect(process.env.mongodb || mongodb, function(err, db) {
					
				dbo = db.db(process.env.thedatabase)
				////////console.log('dbo');
				
				});