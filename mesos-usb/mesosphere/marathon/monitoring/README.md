# Monitoring Mesos

Get statistics from the Mesos slave statistics endpoint with a simple
python program (we call it nibbler)!  Forward stats to an open-source
time series database ([InfluxDB](https://influxdb.com)) and create
dashboards based on ad-hoc queries with [Grafana](http://grafana.org).

## Launch services

**InfluxDB**

```
dcos marathon app add 1-influxdb.json
```

**Nibbler**

```
dcos marathon app add 2-nibbler.json
```

**Grafana**

```
dcos marathon app add 3-grafana.json
```

## Design your dashboard!

Visit the Grafana web UI

1. CPU capacity, allocation, utilization
1. Memory capacity, allocation, utilization
1. Disk capacity, allocation, utilization
1. Number of running tasks
