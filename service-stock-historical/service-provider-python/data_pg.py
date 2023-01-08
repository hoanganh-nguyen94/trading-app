import psycopg2
import os

from datetime import datetime, timedelta, timezone

db_host = os.getenv('DB_HOST', "localhost")
db_port = int(os.getenv('DB_PORT', "5432"))
db_name = os.getenv('DB_NAME', "trading")
db_user = os.getenv('DB_USER', "postgres")
db_pass = os.getenv('DB_PASS', "root@123")


class Data:
    def __init__(self):
        print('init')
        self.db_host = "localhost"

    def get_data(self, symbol):
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
            sql+=' FROM public.hsc_stock where vtotal > 0'
            if (cond != ''):
                sql+=' and symbol in (' + cond + ')'

            #sql+=' LIMIT 50'
            #print('SQL---------------------------------')
            #print(sql)
            #print('SQL---------------------------------')
            cursor.execute(sql)
            rows = cursor.fetchall()
            return rows
        except (Exception) as error:
            print("Error while connecting to PostgreSQL", error)

    #add order
    def insert_order(self, obj):
        conn = psycopg2.connect(database=db_name,
                                host=db_host,
                                user=db_user,
                                password=db_pass,
                                port=db_port)

        time_zone = timezone(timedelta(hours=7))
        date_time = datetime.now(time_zone)
        time_now = date_time.strftime('%Y-%m-%d %H:%M:%S')

        # create order
        cursor = conn.cursor()
        cursor.execute("INSERT INTO hsc_order (client_id, symbol, price, val, type, date_created) VALUES(%s, %s, %s, %s, %s, %s)",
                      (obj["client_id"], obj["symbol"], obj["price"], obj["val"], obj["type"], time_now))

        conn.commit()
        cursor.close()
        conn.close()
