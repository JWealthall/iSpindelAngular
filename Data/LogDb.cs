using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using iSpindelAngular.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace iSpindelAngular.Data
{
    // A single place to put database handling as some functions shared between controllers
    public class LogDb
    {
        public static bool ReadOnly { get; set; } = false;

        private readonly LogDbContext _context;
        public LogDbContext Context => _context;

        public LogDb(LogDbContext context)
        {
            _context = context;
            _context.Database.EnsureCreated();
        }

        public async Task<bool> BatchAdd(Batch batch)
        {
            if (ReadOnly) return false;
            try
            {
                // Check for an existing batch without an end date for the same device - set the end date
                await _context.Batches
                    .Where(b => b.DeviceId == batch.DeviceId && b.EndDate == null)
                    .ForEachAsync(bu => bu.EndDate = batch.StartDate);
                await _context.AddAsync(batch);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BatchExists(batch.BatchId))
                    return batch.StatusData.Failed(-1, "Not Found");

                throw;
            }
            catch (DbUpdateException)
            {
                if (!DeviceExists(batch.DeviceId))
                    return batch.StatusData.Failed(-2, "Device Not Found");
            }
            return true;
        }

        public async Task<Batch> BatchDelete(Guid batchId)
        {
            if (ReadOnly) return null;
            var batch = await _context.Batches.FindAsync(batchId);
            if (batch == null) return null;
            _context.Batches.Remove(batch);
            await _context.SaveChangesAsync();
            return batch;
        }

        public async Task<bool> BatchEnd(Batch batch)
        {
            if (ReadOnly) return false;
            try
            {
                batch.EndDate = DateTime.Now.TrimToSecond();
                _context.Update(batch);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BatchExists(batch.BatchId))
                    return batch.StatusData.Failed(-1, "Not Found");

                throw;
            }
            catch (DbUpdateException)
            {
                if (!DeviceExists(batch.DeviceId))
                    return batch.StatusData.Failed(-2, "Device Not Found");
            }
            return true;
        }

        public bool BatchExists(Guid batchId)
        {
            return _context.Batches.Any(e => e.BatchId == batchId);
        }

        public async Task<Batch>  BatchGet(Guid batchId)
        {
            return await _context.Batches.FindAsync(batchId);
        }

        public async Task<SummaryDataModel> BatchGetWithSummary(Guid batchId)
        {
            var data = new SummaryDataModel();
            data.Batch = await _context.Batches.FindAsync(batchId);
            if (data.Batch == null) return null;
            data.BatchId = batchId;
            data.Batch.Logs = await _context.Logs.Where(l => l.BatchId == batchId).OrderByDescending(l => l.Date).ToListAsync();
            data.DeviceId = data.Batch.DeviceId;
            data.Devices = await DeviceSummaryList(data.DeviceId);
            data.Batches = await BatchSummaryList(batchId: batchId);
            return data;
        }

        public async Task<List<BatchSummary>> BatchSummaryList(Guid? deviceId = null, Guid? batchId = null, bool current = false)
        {
            var t = _context.Logs.GroupBy(l => l.BatchId)
                    .Select(g => new {BatchId = g.Key, Gravity = g.Max(x => x.Gravity)});

            // Get batches and their start and end readings
            var bs = from b in _context.Batches
                     join ls in (
                         _context.Logs.Join(
                             (_context.Logs.GroupBy(l => l.BatchId)
                                 .Select(g => new { g.Key, Date = g.Min(x => x.Date) }))
                             , l => new { l.BatchId, l.Date }
                             , lsj => new { BatchId = lsj.Key, lsj.Date }
                             , (l, lsj) => new { l.BatchId, l.Date, l.Gravity, l.Temperature, l.TempUnits })
                     ) on b.BatchId equals ls.BatchId into lsj
                     from ls in lsj.DefaultIfEmpty()
                     join le in (
                         _context.Logs.Join(
                             (_context.Logs.GroupBy(l => l.BatchId)
                                 .Select(g => new { g.Key, Date = g.Max(x => x.Date) }))
                             , l => new { l.BatchId, l.Date }
                             , lej => new { BatchId = lej.Key, lej.Date }
                             , (l, lej) => new { l.BatchId, l.Date, l.Gravity, l.Temperature })
                     ) on b.BatchId equals le.BatchId into lej
                     from le in lej.DefaultIfEmpty()
                     join lx in _context.Logs.GroupBy(l => l.BatchId)
                         .Select(g => new {BatchId = g.Key, Gravity = g.Max(x => x.Gravity)})
                         on b.BatchId equals lx.BatchId into lxj
                     from lx in lxj.DefaultIfEmpty()
                     join ln in _context.Logs.GroupBy(l => l.BatchId)
                             .Select(g => new {BatchId = g.Key, Gravity = g.Min(x => x.Gravity)})
                         on b.BatchId equals ln.BatchId into lnj
                     from ln in lnj.DefaultIfEmpty()
                     join lh in _context.Logs.GroupBy(l => l.BatchId)
                             .Select(g => new {BatchId = g.Key, Temperature = g.Max(x => x.Temperature)})
                         on b.BatchId equals lh.BatchId into lhj
                     from lh in lhj.DefaultIfEmpty()
                     join ll in _context.Logs.GroupBy(l => l.BatchId)
                             .Select(g => new {BatchId = g.Key, Temperature = g.Min(x => x.Temperature)})
                         on b.BatchId equals ll.BatchId into llj
                     from ll in llj.DefaultIfEmpty()
                     join la in _context.Logs.GroupBy(l => l.BatchId)
                             .Select(g => new {BatchId = g.Key, Temperature = g.Average(x => x.Temperature)})
                         on b.BatchId equals la.BatchId into laj
                     from la in laj.DefaultIfEmpty()
                     where (deviceId == null || b.DeviceId == deviceId.Value)
                           && (batchId == null || b.BatchId == batchId.Value)
                           && (!current || !b.EndDate.HasValue)
                     orderby le.Date descending, ls.Date descending
                     select new BatchSummary(b, ls, le, lx, ln, lh, ll, la);

            //return await (from bx in bs orderby bx.EndDate descending, bx.StartDate descending select bx).ToListAsync();
            return await bs.ToListAsync();
        }

        public async Task<bool> BatchSave(Batch batch)
        {
            if (ReadOnly) return false;
            try
            {
                _context.Update(batch);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BatchExists(batch.BatchId))
                    return batch.StatusData.Failed(-1, "Not Found");

                throw;
            }
            catch (DbUpdateException)
            {
                if (!DeviceExists(batch.DeviceId))
                    return batch.StatusData.Failed(-2, "Device Not Found");
            }
            return true;
        }

        public async Task<Device> DeviceDelete(Guid batchId)
        {
            if (ReadOnly) return null;
            var device = await _context.Devices.FindAsync(batchId);
            if (device == null) return null;
            _context.Devices.Remove(device);
            await _context.SaveChangesAsync();
            return device;
        }

        public bool DeviceExists(Guid deviceId)
        {
            return _context.Devices.Any(e => e.DeviceId == deviceId);
        }

        public async Task<Device> DeviceGet(Guid deviceId)
        {
            return await _context.Devices.FindAsync(deviceId);
        }

        public async Task<List<DeviceSummary>> DeviceSummaryList(Guid? deviceId = null)
        {
            /*
            // If you want to work out a complex set of joins and conditions in EF Linq then break it down into stages first
            // and then gradually merge it into a single statement as per the commented out example below
            var lx = _context.Logs.GroupBy(l => l.DeviceId).Select(g => new {g.Key, Date = g.Max(x => x.Date)});
            var ly = _context.Logs.Join(lx, l => l.Date, lxj => lxj.Date, (l, lxj) => (Log)l);
            var lxz = _context.Logs.Join(
                (_context.Logs.GroupBy(l => l.DeviceId).Select(g => new {g.Key, Date = g.Max(x => x.Date)}))
                , l => l.Date, lxj => lxj.Date, (l, lxj) => (Log)l);

            var dx = from d in _context.Devices
                join l in lxz.DefaultIfEmpty() on d.DeviceId equals l.DeviceId into lgs
                from l in lgs.DefaultIfEmpty()
                select new SummaryDataModel.DeviceSummary(d, l);
            */

            // Get devices and their current state
            var ds = from d in _context.Devices
                     join l in (
                         _context.Logs.Join(
                             (_context.Logs.GroupBy(l => l.DeviceId).Select(g => new { g.Key, Date = g.Max(x => x.Date) }))
                             , l => l.Date, lj => lj.Date, (l, lj) => (Log)l)
                     ) on d.DeviceId equals l.DeviceId into lj
                     from l in lj.DefaultIfEmpty()
                     where deviceId == null || d.DeviceId == deviceId.Value
                     orderby l.Date descending
                     select new DeviceSummary(d, l);
            return await ds.ToListAsync();
        }

        public async Task<bool> DeviceSave(Device device)
        {
            if (ReadOnly) return false;
            try
            {
                _context.Update(device);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeviceExists(device.DeviceId))
                    return device.StatusData.Failed(-1, "Not Found");

                throw;
            }
            return true;
        }

        public async Task<bool> Log(SpindelLog data)
        {
            if (ReadOnly) return false;
            try
            {
                var device = await _context.Devices.SingleOrDefaultAsync(d => d.Name == data.name);
                if (device == null)
                {
                    // Create a new Device
                    device = new Device()
                    {
                        Name = data.name,
                        Token = data.token,
                        SpindelId = data.ID,
                        Description = "New iSpindel"
                    };
                    await _context.Devices.AddAsync(device);
                }

                var log = new Log()
                {
                    Angle = data.angle,
                    Temperature = data.temperature,
                    TempUnits = data.temp_units,
                    Battery = data.battery,
                    Gravity = data.gravity,
                    Interval = data.interval,
                    RSSI = data.interval,
                    DeviceId = device.DeviceId
                };

                var batch = await _context.Batches.SingleOrDefaultAsync(b => b.DeviceId == device.DeviceId && !b.EndDate.HasValue);
                if (batch != null) log.BatchId = batch.BatchId;

                await _context.Logs.AddAsync(log);

                var res = await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task<Log> LogDelete(Guid logId)
        {
            if (ReadOnly) return null;
            var log = await _context.Logs.FindAsync(logId);
            if (log == null) return null;
            _context.Logs.Remove(log);
            await _context.SaveChangesAsync();
            return log;
        }

        public async Task<Log> LogGet(Guid logId)
        {
            return await _context.Logs.FindAsync(logId);
        }

        public async Task<SummaryDataModel> SummaryData(Guid? deviceId = null, bool devicesOnly = false, bool batchesOnly = false, bool current = false)
        {
            var data = new SummaryDataModel();
            data.DeviceId = deviceId;
            data.Devices = await DeviceSummaryList(deviceId);
            if (!devicesOnly) data.Batches = await BatchSummaryList(deviceId, current: current);
            if (deviceId.HasValue && data.Devices.Any()) data.Devices.First().IsDetail = true;
            return data;
        }

    }
}
