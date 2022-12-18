import eventlet
import socketio
import os
from random import random
from threading import Thread, Event
from datetime import datetime
import psycopg2
from numpy import random

sio = socketio.Server(cors_allowed_origins='*', async_mode='eventlet')
app = socketio.WSGIApp(sio)

port= os.getenv('PORT', 8088)
milliseconds = 1000 #1s
thread = None
ip = os.getenv('IP', "0.0.0.0")

#Gia ban 1
def gia_ban_1():
    gb1 = random.choice([3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9])
    return gb1

#Gia ban 2
def gia_ban_2():
    gb2 = random.choice([4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9])
    return gb2

#Gia ban 3
def gia_ban_3():
    gb3 = random.choice([5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9])
    return gb3

#Gia ban 1
def gia_mua_1():
    gm1 = random.choice([2, 2.1, 2.2, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9])
    return gm1

#Gia ban 2
def gia_mua_2():
    gm2 = random.choice([1, 1.1, 1.1, 1.1, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9])
    return gm2

#Gia ban 3
def gia_mua_3():
    gm3 = random.choice([-1, -1.-1, -1.1, -1.-1, -1.4, -1.5, -1.6, -1.7, -1.8, -1.9])
    return gm3

def vtotal():
    total = random.randint(100, 5000)
    return total

def get_data(symbol):
    try:
        # connect to the PostgreSQL server
        cond = ""
        if (symbol != "" and symbol != "*"):
            cond = "'" + symbol.replace(",", "','") + "'"
        
        conn = psycopg2.connect(database="trading",
                            host="tradingDB",
                            user="postgres",
                            password="root@123",
                            port="5433")
        # create a cursor
        cursor = conn.cursor()
        # Execute a sql
        sql='SELECT symbol, price_rp, price_c, price_f, price_m'
        sql+=' FROM public.hsc_stock_new'
        if (cond != ''):
            sql+=' WHERE symbol in (' + cond + ')'
        
        sql+=' LIMIT 50'
        
        #print('SQL---------------------------------')
        #print(sql)
        #print('SQL---------------------------------')
        cursor.execute(sql)
        rows = cursor.fetchall()
        return rows
    except (Exception) as error:
        print("Error while connecting to PostgreSQL", error)
    
def data_response(symbol):
    
    data = get_data(symbol)
    #print('data---------------------------------')
    #print(data)
    #print('data---------------------------------')

    #return arrayStocks
        
def background_thread(symbols):
    print(symbols)
    #arrayStocks = data_response(symbol)
    data = get_data(symbols)
    #print('data---------------------------------')
    #print(data)
    #print('data---------------------------------')
    #          
    while True:
        sio.sleep(milliseconds/1000)
        #sio.emit('message', {'temperature': round(random()*10, 3)})
        arrayStocks = []
        for row in data:
            stocks = {}
            stocks["symbol"] = row[0]
            stocks["rp"] = row[1]
            stocks["c"] = row[2]
            stocks["f"] = row[3]
            mid = float(row[4])
            stocks["ask"] = mid
            stocks["vtotal"] = vtotal()
            #Tinh phan tram gia ban
            stocks["bid1"] = round(((float(gia_ban_1())/100 * mid) + mid), 2)
            stocks["vbid1"] = vtotal()
            stocks["bid2"] = round(((float(gia_ban_2())/100 * mid) + mid), 2)
            stocks["vbid2"] = vtotal()
            stocks["bid3"] = round(((float(gia_ban_3())/100 * mid) + mid), 2)
            stocks["vbid3"] = vtotal()

            #tinh phan tram gia mua
            stocks["ask1"] = round(((float(gia_mua_1())/100 * mid) + mid), 2)
            stocks["vask1"] = vtotal()
            stocks["ask2"] = round(((float(gia_mua_2())/100 * mid) + mid), 2)
            stocks["vask2"] = vtotal()
            stocks["ask3"] = round(((float(gia_mua_3())/100 * mid) + mid), 2)
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
        
@sio.on('detail', namespace='/test')
def respond_test(sio, data):
    print("received test message: {}".format(data))
    global thread
    if thread is None:
        #print(client)
        thread = sio.start_background_task(background_thread, background_thread_detail)
        
    thread = None

@sio.event
def trading_event(sid, message):
    item = message['data']
    #print('---------------------trading_event--------------------:', item)
    #print(sid)
    #print(message)
    #print('---------------------trading_event--------------------:', item)
    #arrayStocks = data_response(item)
    data = get_data(item)
    #print(arrayStocks)
    if (message['data'] != ''):
        while True:
            sio.sleep(milliseconds/1000)
            arrayStocks = []
            for row in data:
                stocks = {}
                stocks["symbol"] = row[0]
                stocks["rp"] = row[1]
                stocks["c"] = row[2]
                stocks["f"] = row[3]
                mid = float(row[4])
                stocks["ask"] = mid
                stocks["vtotal"] = vtotal()
                #Tinh phan tram gia ban
                stocks["bid1"] = round(((float(gia_ban_1())/100 * mid) + mid), 2)
                stocks["vbid1"] = vtotal()
                stocks["bid2"] = round(((float(gia_ban_2())/100 * mid) + mid), 2)
                stocks["vbid2"] = vtotal()
                stocks["bid3"] = round(((float(gia_ban_3())/100 * mid) + mid), 2)
                stocks["vbid3"] = vtotal()

                #tinh phan tram gia mua
                stocks["ask1"] = round(((float(gia_mua_1())/100 * mid) + mid), 2)
                stocks["vask1"] = vtotal()
                stocks["ask2"] = round(((float(gia_mua_2())/100 * mid) + mid), 2)
                stocks["vask2"] = vtotal()
                stocks["ask3"] = round(((float(gia_mua_3())/100 * mid) + mid), 2)
                stocks["vask3"] = vtotal()

                """"
                    stocks["v"] = row[12]
                """
                #add array 
                arrayStocks.append(stocks)

            dt = datetime.now()
            sio.emit('my_response', {'time': str(dt), 'data': arrayStocks}, room=sid )
    
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
    arrayStocks = []
    sio.disconnect(sid)
    print(sid)
    print('Client disconnected', sid)

def main():
    print("Port: " + port)
    #eventle
    thread = None
    #eventlet.wsgi.server(eventlet.listen(('localhost', port)), app)
    eventlet.wsgi.server(eventlet.listen((ip, int(port))), app)
    
if __name__ == '__main__':
    main()