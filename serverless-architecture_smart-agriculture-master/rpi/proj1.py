import sys
import Adafruit_DHT
import RPi.GPIO as GPIO
from mcp3208 import MCP3208
import time
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from datetime import date, datetime
from time import sleep
import picamera
import os
import tinys3
import yaml
import pytz

tz = pytz.timezone('Asia/Kolkata')
now = datetime.now()
now = datetime.now()
now = now.replace(tzinfo = tz)
now = now.astimezone(tz)
# assuming now contains a timezone aware datetime

your_now = now.astimezone(tz)
print your_now


GPIO.setmode (GPIO.BOARD)
GPIO.setup(7,GPIO.OUT)
GPIO.output(7,1)
sensor=Adafruit_DHT.DHT22


#camera
with open("config.yml", 'r') as ymlfile:
    cfg = yaml.load(ymlfile)
	
# photo props
image_width = cfg['image_settings']['horizontal_res']
image_height = cfg['image_settings']['vertical_res']
file_extension = cfg['image_settings']['file_extension']
file_name = cfg['image_settings']['file_name']
photo_interval = cfg['image_settings']['photo_interval'] # Interval between photo (in seconds)
image_folder = cfg['image_settings']['folder_name']

# camera setup
camera = picamera.PiCamera()
camera.resolution = (image_width, image_height)
camera.awb_mode = cfg['image_settings']['awb_mode']

# verify image folder exists and create if it does not
if not os.path.exists(image_folder):
    os.makedirs(image_folder)



# Build filename string
file_name=str(your_now)
filepath = image_folder + '/' + file_name + file_extension

if cfg['debug'] == True:
    print '[debug] Taking photo and saving to path ' + filepath

# Take Photo
camera.capture(filepath)

if cfg['debug'] == True:
    print '[debug] Uploading ' + filepath + ' to s3'

# Upload to S3
conn = tinys3.Connection(cfg['s3']['access_key_id'], cfg['s3']['secret_access_key'])
f = open(filepath, 'rb')
conn.upload(filepath, f, cfg['s3']['bucket_name'],
           headers={
           'x-amz-meta-cache-control': 'max-age=60'
           })


if os.path.exists(filepath):
    os.remove(filepath)

	
adc=MCP3208()
moisture=adc.read(0)
rain=adc.read(1)
light=adc.read(2)
print("moisture",moisture)
print("rain",rain)
print("light",light)

humidity,temp=Adafruit_DHT.read_retry(11,4)

print("temp",temp)
print("humidity",humidity)
	
myMQTTClient = AWSIoTMQTTClient("new_Client")
myMQTTClient.configureEndpoint("a3so5jr4thekwx.iot.us-east-1.amazonaws.com", 8883)
myMQTTClient.configureCredentials("./certs/Amazon-Root-CA-1.pem", "./certs/757c46f88e-private.pem.key", "./certs/757c46f88e-certificate.pem.crt")
myMQTTClient.configureOfflinePublishQueueing(-1)
myMQTTClient.configureDrainingFrequency(2)
myMQTTClient.configureConnectDisconnectTimeout(40)
myMQTTClient.configureMQTTOperationTimeout(20)
	
connecting_time = time.time() + 20
if time.time() < connecting_time:
	myMQTTClient.connect()
	myMQTTClient.publish("proj1","connected",0)
	print "MQTT Client connection success!"
else:
	print "Error: Check your AWS details in the program"
	

a=3;
payload = '{"dateandtime": "' + str(your_now) + '","temperature": ' + str(temp) + ',"humidity": '+ str(humidity) + ',"moisture": ' + str(moisture) + ',"rain": ' + str(rain) + ',"light": ' + str(light)+ ',"photo": '+'"https://s3.amazonaws.com/smartagricultureimage/images/'+str(your_now)+'.jpg"' ' }'
#payload='{"'+current_time+'":'+payload+"}"
print(payload)
myMQTTClient.publish("proj1", payload, 0)



GPIO.cleanup()
