using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using iSpindelAngular.Data;
using iSpindelAngular.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace iSpindelAngular.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private readonly ILogger<DataController> _logger;
        private readonly LogDb _logDb;

        public DataController(ILogger<DataController> logger, LogDbContext context)
        {
            _logger = logger;
            _logDb = new LogDb(context);
            //_context = context;
        }

        #region Batch
        [HttpGet]
        [Route("Batch/{batchId:Guid}")]
        public async Task<ActionResult<Batch>> Batch(Guid batchId)
        {
            return await _logDb.BatchGet(batchId);
        }

        [HttpPost]
        [Route("BatchCreate")]
        public async Task<Batch> BatchCreate([FromBody] Batch batch)
        {
            if (batch == null) return new Batch() { StatusData = StatusData.Failure("No batch supplied") };
            if (!ModelState.IsValid) return batch.Failure("Model isn't valid");
            await _logDb.BatchAdd(batch);
            return batch;
        }

        [HttpPost]
        [Route("BatchEnd/{batchId:Guid}")]
        public async Task<Batch> BatchEnd(Guid batchId, [FromBody] Batch batch)
        {
            if (batch == null) return new Batch() { StatusData = StatusData.Failure("No batch supplied") };
            if (batchId != batch.BatchId) return batch.Failure("Batch Id doesn't match route");
            if (!ModelState.IsValid) return batch.Failure("Model isn't valid");
            await _logDb.BatchEnd(batch);
            return batch;
        }

        [HttpGet]
        [Route("BatchList")]
        public async Task<ActionResult<List<Batch>>> BatchList()
        {
            return await _logDb.Context.Batches.ToListAsync();
        }

        [HttpPost]
        [Route("BatchUpdate/{batchId:Guid}")]
        public async Task<Batch> BatchUpdate(Guid batchId, [FromBody] Batch batch)
        {
            if (batch == null) return new Batch() { StatusData = StatusData.Failure("No batch supplied") };
            if (batchId != batch.BatchId) return batch.Failure("Batch Id doesn't match route");
            if (!ModelState.IsValid) return batch.Failure("Model isn't valid");
            await _logDb.BatchSave(batch);
            return batch;
        }
        #endregion Batch

        #region Device
        [HttpGet]
        [Route("Device/{deviceId:Guid}")]
        public async Task<Device> Device(Guid deviceId)
        {
            return await _logDb.DeviceGet(deviceId);
        }

        [HttpGet]
        [Route("DeviceList")]
        public async Task<List<Device>> DeviceList()
        {
            return await _logDb.Context.Devices.ToListAsync();
        }

        [HttpPost]
        [Route("DeviceUpdate/{deviceId:Guid}")]
        public async Task<Device> DeviceUpdate(Guid deviceId, [FromBody] Device device)
        {
            if (device == null) return new Device() { StatusData = StatusData.Failure("No device supplied") };
            if (deviceId != device.DeviceId) return device.Failure("Device Id doesn't match route");
            if (!ModelState.IsValid) return device.Failure("Model isn't valid");
            await _logDb.DeviceSave(device);
            return device;
        }
        #endregion Device

        #region Log
        [HttpPost]
        [Route("Log")]
        public async Task<ActionResult<bool>> Log(SpindelLog data)
        {
            return await _logDb.Log(data);
        }

        [HttpGet]
        [Route("Log/{logId:Guid}")]
        public async Task<Log> Log(Guid logId)
        {
            return await _logDb.LogGet(logId);
        }

        [HttpPost]
        [Route("LogDelete/{logId:Guid}")]
        public async Task<Log> LogDelete(Guid logId, [FromBody] Log log)
        {
            if (log == null) return new Log() { StatusData = StatusData.Failure("No log supplied") };
            if (logId != log.LogId) return log.Failure("Log Id doesn't match route");
            if (!ModelState.IsValid) return log.Failure("Model isn't valid");
            await _logDb.LogDelete(logId);
            return log;
        }
        #endregion Log

        #region Summary
        [HttpGet]
        [Route("BatchesSummary")]
        public async Task<SummaryDataModel> BatchesSummary()
        {
            return await _logDb.SummaryData(batchesOnly: true);
        }

        [HttpGet]
        [Route("BatchSummary/{batchId:Guid}")]
        public async Task<SummaryDataModel> BatchSummary(Guid batchId)
        {
            return await _logDb.BatchGetWithSummary(batchId);
        }

        [HttpGet]
        [Route("DevicesSummary")]
        public async Task<SummaryDataModel> DevicesSummary()
        {
            return await _logDb.SummaryData(devicesOnly: true);
        }

        [HttpGet]
        [Route("DeviceSummary/{deviceId:Guid}")]
        public async Task<SummaryDataModel> DeviceSummary(Guid deviceId)
        {
            return await _logDb.SummaryData(deviceId);
        }

        [HttpGet]
        [Route("Summary")]
        public async Task<SummaryDataModel> Summary()
        {
            return await _logDb.SummaryData();
        }
        #endregion Summary

    }
}