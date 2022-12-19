FROM python
ADD server.py /

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

EXPOSE 8088
RUN chmod -x /server.py

CMD ["python3" ,"./server.py" ]
