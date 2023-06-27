"use strict";

const { metrics, diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { MeterProvider, PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");

const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-grpc");

const { Resource } = require("@opentelemetry/resources");

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), {
  logLevel: DiagLogLevel.INFO,
  suppressOverrideMessage: true
});

// Object that holds all the metrics we create
const meterProvider = new MeterProvider({
  resource: new Resource({ "service.name": "opentelemetry-metrics-example" })
});

// Object that sends metrics to OTel collector
const metricExporter = new OTLPMetricExporter();

// Object that reads the accumulated metrics from the provider and sends them to the MetricsExporter
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 10000

});

metrics.setGlobalMeterProvider(meterProvider);
meterProvider.addMetricReader(metricReader);
