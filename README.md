# node-onvif-ts

Typescript version of [node-onvif](https://github.com/futomi/node-onvif). The structure of original node-onvif is refactored to adapt to typescript.

# Changes

 - move javascript to typescript
 - remove the callback support for async function. Async functions now all return a `Promise` object.

# Usage

```shell
# npm
npm i -s node-onvif-ts

# yarn
yarn add node-onvif-ts
```

# Examples

## Discover ONVIF network cameras

```typescript
import { startProbe } from 'node-onvif-ts';

console.log('Start the discovery process.');
// Find the ONVIF network cameras.
// It will take about 3 seconds.

startProbe().then((deviceInfoList) => {
  console.log(deviceInfoList.length + ' devices were found.');
  // Show the device name and the URL of the end point.
  deviceInfoList.forEach((info) => {
    console.log('- ' + info.urn);
    console.log('  - ' + info.name);
    console.log('  - ' + info.xaddrs[0]);
  });
}).catch((error) => {
  console.error(error);
});
})
```

The code above will output the result like this:

```
Start the discovery process.
5 devices were found.
- urn:uuid:cd279d60-afd3-3a22-00dc-daaa234e772c
  - Canon VB-S30D
  - http://192.168.10.10:80/onvif/device_service
- urn:uuid:13814000-8752-1052-bfff-045d4b150782
  - Sony
  - http://192.168.10.14/onvif/device_service
- urn:uuid:4d454930-0000-1000-8000-bcc34217e292
  - Panasonic BB-SC384B
  - http://192.168.10.12/onvif/device_service
- urn:uuid:00030050-0000-1000-8000-104fa8e2cc96
  - Sony
  - http://192.168.10.25/onvif/device_service
- urn:uuid:8b10a2e0-3302-48df-9d1a-1197c360e6ca
  - Avantgarde-Test
  - http://192.168.10.27:36000/onvif/device_service
```

This discovery function are based on udp.

## Create an `OnvifDevice` object

```typescript
import { OnvifDevice } from 'node-onvif-ts';

// Create an OnvifDevice object
const device = new OnvifDevice({
  xaddr: 'http://192.168.10.10:80/onvif/device_service',
  user : 'admin',
  pass : '123456'
});

// Initialize the OnvifDevice object
device.init().then((info) => {
  // Show the detailed information of the device.
  console.log(JSON.stringify(info, null, '  '));
}).catch((error) => {
  console.error(error);
});
```

The code above will output the result like this:
```json
{
  "Manufacturer": "Canon",
  "Model": "VB-S30D",
  "FirmwareVersion": "Ver. 1.3.3",
  "SerialNumber": "999999999999",
  "HardwareId": "1D"
}
```

Meanwhile, the OnvifDevice can be also initialized by: 
```typescript
const device = new OnvifDevice({
    xaddr: 'http://192.168.10.10:80/onvif/device_service',
});

device.setAuth('admin', '123456');
```

## Get the stream URL

```JavaScript
import { OnvifDevice } from 'node-onvif-ts';

// Create an OnvifDevice object
let device = new OnvifDevice({
  xaddr: 'http://192.168.10.14:10080/onvif/device_service',
  user : 'admin',
  pass : '123456'
});

// Initialize the OnvifDevice object
device.init().then(() => {
  // Get the UDP stream URL
  let url = device.getUdpStreamUrl();
}).catch((error) => {
  console.error(error);
});
```

The code above will output the result like this:

```
rtsp://192.168.10.14:10554/tcp/av0_0
```

## Get the snapshot

```typescript
import { OnvifDevice }  from 'node-onvif-ts';
import { writeFileSync } from 'fs';

// Create an OnvifDevice object
let device = new OnvifDevice({
  xaddr: 'http://192.168.10.14:10080/onvif/device_service',
  user : 'admin',
  pass : '123456'
});

// Initialize the OnvifDevice object
device.init().then(() => {
  // Get the data of the snapshot
  console.log('fetching the data of the snapshot...');
  return device.fetchSnapshot();
}).then((res) => {
  // Save the data to a file
  writeFileSync('snapshot.jpg', res.body, {encoding: 'binary'});
  console.log('Done!');
}).catch((error) => {
  console.error(error);
});
```

The code above will output the result like this:
```
fetching the data of the snapshot...
Done!
```

You will find a JPEG file named `snapshot.jpg` in the current directory.

## Control the PTZ

```typescript
import { OnvifDevice } from 'node-onvif-ts';

// Create an OnvifDevice object
let device = new onvif.OnvifDevice({
  xaddr: 'http://192.168.10.14:10080/onvif/device_service',
  user : 'admin',
  pass : '123456'
});

// Initialize the OnvifDevice object
device.init().then(() => {
  // Move the camera
  return device.ptzMove({
    'speed': {
      x: 1.0, // Speed of pan (in the range of -1.0 to 1.0)
      y: 0.0, // Speed of tilt (in the range of -1.0 to 1.0)
      z: 0.0  // Speed of zoom (in the range of -1.0 to 1.0)
    },
    'timeout': 1 // seconds
  });
}).then(() => {
  console.log('Done!');
}).catch((error) => {
  console.error(error);
});
```

If this code has been successfully finished, you could find that the camera turns to the right for a second at the highest speed.

# Onvif functions

Some Onvif commands are also implemented in `node-onvif-ts` and the input arguments are carefully typed. Please see [node-onvif](https://github.com/futomi/node-onvif) for more details. The response for onvif commands are not typed now.