import eventlet
import socketio
import os
from threading import Thread, Event
from datetime import datetime
from numpy import random
from data_pg import Data
import json

sio = socketio.Server(cors_allowed_origins='*', async_mode='eventlet')
app = socketio.WSGIApp(sio)

port= os.getenv('PORT', 8088)
milliseconds = 1000 #1s
thread = None
ip = os.getenv('IP', "0.0.0.0")


def gia_mua_ban():
    list_price = []
    #lay danh sach 6 gia
    x = range(6)
    for n in x:
      num = (random.randint(-3000, 3000))/1000
      list_price.append(round(num, 2))

    #sap xep tang dan
    list_price.sort()

    return list_price

#tinh phan tram gia khop lenh
def phan_tram_khop_lenh():
    num = (random.randint(-3000, 3000))/1000
    return round(num, 2)

def vtotal():
    total = random.randint(100, 5000)
    return total

def data_response(symbol):
    data = Data()
    datas = data.get_data(symbol)
    #print('data---------------------------------')
    #print(data)
    #print('data---------------------------------')

    #return arrayStocks

def background_thread(symbols):
    print(symbols)
    #arrayStocks = data_response(symbol)
    data = Data()
    datas = data.get_data(symbols)
    #print('data---------------------------------')
    #print(data)
    #print('data---------------------------------')
    #
    while True:
        sio.sleep(milliseconds/1000)
        #sio.emit('message', {'temperature': round(random()*10, 3)})
        arrayStocks = []
        for row in datas:
            stocks = {}
            stocks["symbol"] = row[0]
            stocks["rp"] = row[1]
            stocks["c"] = row[2]
            stocks["f"] = row[3]
            mid = float(row[4])
            stocks["ask"] = mid
            stocks["vtotal"] = row[5]
            #tinh phan tram gia khop lenh
            pt_khop_lenh = float(phan_tram_khop_lenh())

            gia_khop_lenh = round(((pt_khop_lenh/100 * mid) + mid), 2)
            if (gia_khop_lenh > float(row[2])):
                gia_khop_lenh = float(row[2])
            if (gia_khop_lenh < float(row[3])):
                gia_khop_lenh = float(row[3])

            gia_mb = gia_mua_ban()
            #gia mua
            gia_mua_1 = gia_mb[0]
            gia_mua_2 = gia_mb[1]
            gia_mua_3 = gia_mb[2]
            #gia ban
            gia_ban_1 = gia_mb[3]
            gia_ban_2 = gia_mb[4]
            gia_ban_3 = gia_mb[5]

            #gia ban 1
            stocks["bid1"] = round(((gia_ban_1/100 * gia_khop_lenh) + gia_khop_lenh), 2)
            stocks["vbid1"] = vtotal()
            #gia ban 2
            stocks["bid2"] = round(((gia_ban_2/100 * gia_khop_lenh) + gia_khop_lenh), 2)
            stocks["vbid2"] = vtotal()
            #gia ban 3
            stocks["bid3"] = round(((gia_ban_3/100 * gia_khop_lenh) + gia_khop_lenh), 2)
            stocks["vbid3"] = vtotal()

            #gia mua 1
            stocks["ask1"] = round(((gia_mua_1/100 * gia_khop_lenh) + gia_khop_lenh), 2)
            stocks["vask1"] = vtotal()
            #gia mua 2
            stocks["ask2"] = round(((gia_mua_2/100 * gia_khop_lenh) + gia_khop_lenh), 2)
            stocks["vask2"] = vtotal()
            #gia mua 3
            stocks["ask3"] = round(((gia_mua_3/100 * gia_khop_lenh) + gia_khop_lenh), 2)
            stocks["vask3"] = vtotal()

            """"
                stocks["v"] = row[12]
            """
            #add array
            arrayStocks.append(stocks)

        dt = datetime.now()
        sio.emit('message', {'time': str(dt), 'data': arrayStocks} )

def background_thread_detail():
    count = 0
    while True:
        sio.sleep(milliseconds/1000)
        sio.emit('my_response', {'data': 'Server generated event'})

@sio.event
def trading_event(sid, message):
    item = message['data']
    #arrayStocks = data_response(item)
    data = Data()
    datas = data.get_data(item)
    #print('---------------------Data--------------------')
    #print(data)
    #print('---------------------Data--------------------')
    #print(arrayStocks)
    if (message['data'] != ''):
        while True:
            sio.sleep(milliseconds/1000)
            arrayStocks = []
            for row in datas:
                stocks = {}
                stocks["symbol"] = row[0]
                stocks["rp"] = row[1]
                stocks["c"] = row[2]
                stocks["f"] = row[3]
                mid = float(row[4])
                stocks["ask"] = mid
                stocks["vtotal"] = row[5]
                #tinh phan tram gia khop lenh
                pt_khop_lenh = float(phan_tram_khop_lenh())

                gia_khop_lenh = round(((pt_khop_lenh/100 * mid) + mid), 2)
                if (gia_khop_lenh > float(row[2])):
                    gia_khop_lenh = float(row[2])
                if (gia_khop_lenh < float(row[3])):
                    gia_khop_lenh = float(row[3])

                gia_mb = gia_mua_ban()
                #gia mua
                gia_mua_1 = gia_mb[0]
                gia_mua_2 = gia_mb[1]
                gia_mua_3 = gia_mb[2]
                #gia ban
                gia_ban_1 = gia_mb[3]
                gia_ban_2 = gia_mb[4]
                gia_ban_3 = gia_mb[5]

                #gia ban 1
                stocks["bid1"] = round(((gia_ban_1/100 * gia_khop_lenh) + gia_khop_lenh), 2)
                stocks["vbid1"] = vtotal()
                #gia ban 2
                stocks["bid2"] = round(((gia_ban_2/100 * gia_khop_lenh) + gia_khop_lenh), 2)
                stocks["vbid2"] = vtotal()
                #gia ban 3
                stocks["bid3"] = round(((gia_ban_3/100 * gia_khop_lenh) + gia_khop_lenh), 2)
                stocks["vbid3"] = vtotal()

                #gia mua 1
                stocks["ask1"] = round(((gia_mua_1/100 * gia_khop_lenh) + gia_khop_lenh), 2)
                stocks["vask1"] = vtotal()
                #gia mua 2
                stocks["ask2"] = round(((gia_mua_2/100 * gia_khop_lenh) + gia_khop_lenh), 2)
                stocks["vask2"] = vtotal()
                #gia mua 3
                stocks["ask3"] = round(((gia_mua_3/100 * gia_khop_lenh) + gia_khop_lenh), 2)
                stocks["vask3"] = vtotal()

                """"
                    stocks["v"] = row[12]
                    Gia khop lenh
                    KL khop lenh
                    Tong KL khop lenh
                    Tong gia tri khop lenh(sum(gia * kl))
                """
                #add array
                arrayStocks.append(stocks)

            dt = datetime.now()
            sio.emit('my_response', {'time': str(dt), 'data': arrayStocks}, room=sid )

#order
#@sio.on('order', namespace='/orders')
@sio.event
def trading_order(sid, message):
    try:
        print("Message:", message)
        data = Data()

        print(message["data"])
        for obj in message["data"]:
            data.insert_order(obj)

        dt = datetime.now()
        sio.emit('reply_order', {'status': 1, 'msg': 'order success'}, room=sid )

    except (Exception) as error:
        sio.emit('reply_order', {'status': 0, 'msg': 'order failed'}, room=sid )

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
            sio.emit('my_response', {'broadcast': message['data'], 'time': str(dt), 'data': arrayStocks}, room=sid  )

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
    #send data to client      root@123
    global thread
    ###if thread is None:
        #print(client)
    ###    thread = sio.start_background_task(background_thread, symbol)

    thread = None
    arrayStocks = []
    return thread

@sio.event
def disconnect(sid):
    thread = None
    sio.disconnect(sid)
    print(sid)
    print('Client disconnected', sid)

def main():
    #print("Port: " + port)
    #eventle
    thread = None
    eventlet.wsgi.server(eventlet.listen((ip, int(port))), app)

if __name__ == '__main__':
    main()
