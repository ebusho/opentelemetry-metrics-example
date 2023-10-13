"use strict";

const { metrics, diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { MeterProvider, PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");

const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc'); // port 4317
// const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-http"); // port 4318
// const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-proto"); // port 4318

const { Resource } = require("@opentelemetry/resources");

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), {
  logLevel: DiagLogLevel.INFO,
  suppressOverrideMessage: true
});

// Object that holds all the metrics we create
const meterProvider = new MeterProvider({
  resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: "opentelemetry-metrics-example" })
});

// Object that sends metrics to OTel collector
const metricExporter = new OTLPMetricExporter({
  // url: "http://localhost:4318/v1/metrics",
  url: "http://localhost:4317"
  // url: "http://opentelemetry-collector.dappradar-observability.svc.cluster.local:4318/v1/metrics",
  // url: "http://opentelemetry-collector.dappradar-observability.svc.cluster.local:4317"
});

// Object that reads the accumulated metrics from the provider and sends them to the MetricsExporter
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 10000

});

metrics.setGlobalMeterProvider(meterProvider);
meterProvider.addMetricReader(metricReader);
