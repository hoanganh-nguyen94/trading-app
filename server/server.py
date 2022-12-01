import eventlet
import socketio
from random import random
from threading import Thread, Event
from datetime import datetime

sio = socketio.Server(cors_allowed_origins='*', async_mode='eventlet')
app = socketio.WSGIApp(sio)

port=8801
milliseconds = 200
thread = None
ip = "0.0.0.0"


def data_response(symbol):
    arrayStocks = []
    for i in range(100):
        stockCode = "AA" + str(i+1);
        stocks = {}
        stocks["symbol"] = stockCode
        stocks["rp"] = "7.81" #gia tham chieu reference prices
        stocks["c"] = "8.35" #tran celling
        stocks["f"] = "7.27" #san floor
        stocks["vTotal"] = "80000" # total khoi luong volume
        stocks["bid1"] = "7.31" # gia ban 1
        stocks["vBid1"] =  "6000" # khoi luong gia ban 1,
        stocks["bid2"] = "7.32" # gia ban 2,
        stocks["vBid2"] = "2000" # khoi luong gia ban 3,
        stocks["bid3"] = "7.33" # gia ban 3,
        stocks["vBid3"] = "3000"  # khoi luong ban giá 3,
        stocks["ask"] = "7.34" # gia khop kenh
        stocks["v"] = "100000" # gia khop volume
        stocks["ask1"] = "7.34" # giá 1
        stocks["vAsk1"] = "1000" # khoi luong gia mua 1
        stocks["ask2"] = "7.35" # giá 2,
        stocks["vAsk2"] = "2000" # khoi luong giá mua 2,
        stocks["ask3"] = "7.36" # giá 3,
        stocks["vAsk3"] = "3000" #khoi luong giá mua 3

        if symbol == '*':
            arrayStocks.append(stocks)
        elif(symbol == stockCode):
            arrayStocks.append(stocks)
            break
    return arrayStocks

def background_thread(symbols):
    symbol = '*';
    arrayStocks = data_response(symbol)

    while True:
        sio.sleep(milliseconds/1000)
        #sio.emit('message', {'temperature': round(random()*10, 3)})
        dt = datetime.now()
        sio.emit('message', {'symbol': symbol, 'time': str(dt), 'data': arrayStocks} )

def background_thread_detail():
    count = 0
    while True:
        sio.sleep(milliseconds/1000)
        sio.emit('my_response', {'data': 'Server generated event'})

@sio.on('detail', namespace='/test')
def respond_test(sio, data):
    print("received test message: {}".format(data))
    global thread
    if thread is None:
        #print(client)
        thread = sio.start_background_task(background_thread, background_thread_detail)

    thread = None

@sio.event
def my_event(sid, message):
    item = message['data']
    print('---------------------my_event--------------------:', item)
    #print(sid)
    #print(message)
    print('---------------------my_event--------------------:', item)
    arrayStocks = data_response(item)
    #print(arrayStocks)
    if (message['data'] != ''):
        while True:
            sio.sleep(milliseconds/1000)
            dt = datetime.now()
            sio.emit('my_response', {'event': message['data'], 'time': str(dt), 'data': arrayStocks} )

@sio.event
def my_broadcast_event(sid, message):
    item = message['data']
    print('---------------------my_broadcast_event--------------------:', item)
    #print(sid)
    #print(message)
    print('---------------------my_broadcast_event--------------------:', item)
    arrayStocks = data_response(item)
    #print(arrayStocks)
    if (message['data'] != ''):
        while True:
            sio.sleep(milliseconds/1000)
            dt = datetime.now()
            sio.emit('my_response', {'broadcast': message['data'], 'time': str(dt), 'data': arrayStocks} )

@sio.event
def connect(sid, environ):
    print('Client Connected', sid)
    global ip
    print('IP->' + environ['REMOTE_ADDR'])

    symbol = '*'
    #get Param
    ##queryString = environ['QUERY_STRING']
    ##arrParam = queryString.split("&")
    ##symbol = ''
    ##for item in arrParam:
    ##    arrParam1 = item.split("=")
    ##    for item1 in arrParam1:
    ##        if (item1 == 'symbol'):
    ##            symbol = item

    #print(environ)
    #send data to client
    global thread
    if thread is None:
        #print(client)
        thread = sio.start_background_task(background_thread, symbol)

    thread = None
    arrayStocks = []
    return thread

@sio.event
def disconnect(sid):
    thread = None
    arrayStocks = []
    sio.disconnect(sid)
    print('Client disconnected', sid)

def main():
    print("Port: " + str(port))
    #thread = sio.start_background_task(background_thread)
    #eventlet.wsgi.server(eventlet.listen(('localhost', port)), app)
    #eventle
    thread = None
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', port)), app)


if __name__ == '__main__':
    main()
