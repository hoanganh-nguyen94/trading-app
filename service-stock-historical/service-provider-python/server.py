import eventlet
import socketio
import os
from threading import Thread, Event
from datetime import datetime
import psycopg2
from numpy import random

sio = socketio.Server(cors_allowed_origins='*', async_mode='eventlet')
app = socketio.WSGIApp(sio)

port= os.getenv('PORT', 8088)
milliseconds = int(os.getenv('MILL', 1000)) #1s
thread = None
ip = os.getenv('IP', "0.0.0.0")
db_host = "localhost"
db_port = 5433
db_name = "trading"
db_user = "postgres"
db_pass = "root@123"

#Gia ban 1
def gia_ban_1():
    gb1 = random.choice([1, 1.1, 1.1, 1.1, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9])
    return gb1

#Gia ban 2
def gia_ban_2():
    gb2 = random.choice([2, 2.1, 2.2, 2.2, 2.3, 2.4])
    return gb2

#Gia ban 3
def gia_ban_3():
    gb3 = random.choice([2.5, 2.6, 2.7, 2.8, 2.9, 3])
    return gb3

#Gia ban 1
def gia_mua_1():
    gm1 =  random.choice([-2.5, -2.6, -2.7, -2.8, -2.9, -3])
    return gm1

#Gia ban 2
def gia_mua_2():
    gm2 = random.choice([-2, -2.1, -2.-2, -2.2, -2.3, -2.4])
    return gm2

#Gia ban 3
def gia_mua_3():
    gm3 = random.choice([-1, -1.1, -1.1, -1.-1, -1.4, -1.5, -1.6, -1.7, -1.8, -1.9])
    return gm3
    
#Gia ban 3
def gia_khop_lenh():
    gm3 = random.choice([-1, -1.1, -1.1, -1.1, -1.4, -1.5, -1.6, -1.7, -1.8, -1.9, -2,-2.1, -2.2, -2.3, -2.4, -2.5, -2.6, -2.7, -2.8, -2.9, -3,1, 1.1, 1.1, 1.1, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3])
    return gm3

def vtotal():
    total = random.randint(100, 5000)
    return total

def get_data(symbol):
    print(symbol)

    try:

        # connect to the PostgreSQL server
        cond = ""
        if (symbol != "" and symbol != "*"):
            cond = "'" + symbol.replace(",", "','") + "'"

        conn = psycopg2.connect(database=db_name,
                            host=db_host,
                            user=db_user,
                            password=db_pass,
                            port=db_port)
        # create a cursor
        cursor = conn.cursor()
        # Execute a sql
        sql='SELECT symbol, price_rp, price_c, price_f, price_m, vtotal'
        sql+=' FROM public.hsc_stock_new where vtotal > 0' 
        if (cond != ''):
            sql+=' and symbol in (' + cond + ')'

        #sql+=' LIMIT 50'

        print('SQL---------------------------------')
        print(sql)
        print('SQL---------------------------------')
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
            stocks["vtotal"] = row[5]
            #tinh gia khop lenh 
            phan_tram_khop_lenh = float(gia_khop_lenh())

            g_khop_lenh = round(((phan_tram_khop_lenh/100 * mid) + mid), 2)
            if (g_khop_lenh > float(row[2])):
                g_khop_lenh = float(row[2])
            if (g_khop_lenh < float(row[3])):
                g_khop_lenh = float(row[3])
            
            #Tinh phan tram gia ban
            stocks["bid1"] = round(((float(gia_ban_1())/100 * g_khop_lenh) + g_khop_lenh), 2)
            stocks["vbid1"] = vtotal()
            stocks["bid2"] = round(((float(gia_ban_2())/100 * g_khop_lenh) + g_khop_lenh), 2)
            stocks["vbid2"] = vtotal()
            stocks["bid3"] = round(((float(gia_ban_3())/100 * g_khop_lenh) + g_khop_lenh), 2)
            stocks["vbid3"] = vtotal()

            #tinh phan tram gia mua
            stocks["ask1"] = round(((float(gia_mua_1())/100 * g_khop_lenh) + g_khop_lenh), 2)
            stocks["vask1"] = vtotal()
            stocks["ask2"] = round(((float(gia_mua_2())/100 * g_khop_lenh) + g_khop_lenh), 2)
            stocks["vask2"] = vtotal()
            stocks["ask3"] = round(((float(gia_mua_3())/100 * g_khop_lenh) + g_khop_lenh), 2)
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
    #print('---------------------Data--------------------')
    #print(data)
    #print('---------------------Data--------------------')
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
                stocks["vtotal"] = row[5]
                #tinh gia khop lenh 
                phan_tram_khop_lenh = float(gia_khop_lenh())

                g_khop_lenh = round(((phan_tram_khop_lenh/100 * mid) + mid), 2)
                if (g_khop_lenh > float(row[2])):
                    g_khop_lenh = float(row[2])
                if (g_khop_lenh < float(row[3])):
                    g_khop_lenh = float(row[3])
                
                #Tinh phan tram gia ban
                stocks["bid1"] = round(((float(gia_ban_1())/100 * g_khop_lenh) + g_khop_lenh), 2)
                stocks["vbid1"] = vtotal()
                stocks["bid2"] = round(((float(gia_ban_2())/100 * g_khop_lenh) + g_khop_lenh), 2)
                stocks["vbid2"] = vtotal()
                stocks["bid3"] = round(((float(gia_ban_3())/100 * g_khop_lenh) + g_khop_lenh), 2)
                stocks["vbid3"] = vtotal()

                #tinh phan tram gia mua
                stocks["ask1"] = round(((float(gia_mua_1())/100 * g_khop_lenh) + g_khop_lenh), 2)
                stocks["vask1"] = vtotal()
                stocks["ask2"] = round(((float(gia_mua_2())/100 * g_khop_lenh) + g_khop_lenh), 2)
                stocks["vask2"] = vtotal()
                stocks["ask3"] = round(((float(gia_mua_3())/100 * g_khop_lenh) + g_khop_lenh), 2)
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
    #print("Port: " + port)
    #eventle
    thread = None
    eventlet.wsgi.server(eventlet.listen((ip, int(port))), app)

if __name__ == '__main__':
    main()
