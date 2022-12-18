FROM python
ADD server.py /

#RUN pip3 install pandas
#RUN pip3 install requests
# RUN pip3 install flask
#RUN pip3 install numpy
#RUN pip3 install lxml
#RUN pip3 install gunicorn
#RUN pip3 install gevent
RUN pip3 install eventlet
RUN pip3 install numpy
RUN pip3 install psycopg2
RUN pip3 install python-socketio
#RUN pip3 install socketio

EXPOSE 8801
RUN chmod -x /server.py

CMD ["python3" ,"./server.py" ]
