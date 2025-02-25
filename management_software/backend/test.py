
import cv2
import numpy as np
from PIL import ImageGrab
import urllib.request



url = 'http://192.168.1.81/capture?_cb=1656024603205'






previous_frame = None

while True:
    img_resp2=urllib.request.urlopen(url)
    imgnp2=np.array(bytearray(img_resp2.read()),dtype=np.uint8)
    frame = cv2.imdecode(imgnp2,-1) 

    # 1. Load image; convert to RGB
    img_brg = frame
    img_rgb = cv2.cvtColor(src=img_brg, code=cv2.COLOR_BGR2RGB)


    # 2. Prepare image; grayscale and blur
    prepared_frame = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)
    prepared_frame = cv2.GaussianBlur(src=prepared_frame, ksize=(5, 5), sigmaX=0)

    # 2. Calculate the difference
    if (previous_frame is None):
        # First frame; there is no previous one yet
        previous_frame = prepared_frame
        continue

    # 3. Set previous frame and continue if there is None
    if (previous_frame is None):
        # First frame; there is no previous one yet
        previous_frame = prepared_frame
        continue

    # calculate difference and update previous frame
    diff_frame = cv2.absdiff(src1=previous_frame, src2=prepared_frame)
    previous_frame = prepared_frame

    # 4. Dilute the image a bit to make differences more seeable; more suitable for contour detection
    kernel = np.ones((5, 5))
    diff_frame = cv2.dilate(diff_frame, kernel, 1)

    # 5. Only take different areas that are different enough (>20 / 255)
    # thresh_frame = cv2.adaptiveThreshold(diff_frame,255,cv2.ADAPTIVE_THRESH_MEAN_C,\
    #         cv2.THRESH_BINARY,11,2)

    # 6. Find and optionally draw contours
    contours, _ = cv2.findContours(image=diff_frame, mode=cv2.RETR_EXTERNAL, method=cv2.CHAIN_APPROX_SIMPLE)
    # Comment below to stop drawing contours
    cv2.drawContours(image=img_rgb, contours=contours, contourIdx=-1, color=(0, 255, 0), thickness=2, lineType=cv2.LINE_AA)
    # Uncomment 6 lines below to stop drawing rectangles
    for contour in contours:
      if cv2.contourArea(contour) < 2000000:
        # too small: skip!
          continue
      (x, y, w, h) = cv2.boundingRect(contour)
      cv2.rectangle(img=img_rgb, pt1=(x, y), pt2=(x + w, y + h), color=(0, 255, 0), thickness=2)

    cv2.imshow('Motion detector', img_rgb)

    if (cv2.waitKey(30) == 27):
        # out.release()
        break

# Cleanup
cv2.destroyAllWindows()