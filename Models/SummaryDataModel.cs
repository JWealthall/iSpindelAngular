using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace iSpindelAngular.Models
{
    public class SummaryDataModel
    {
        public Guid? DeviceId { get; set; }
        public Guid? BatchId { get; set; }
        public List<DeviceSummary> Devices { get; set; }
        public List<BatchSummary> Batches { get; set; }

        public Batch Batch { get; set; }

        public string DeviceName
        {
            get
            {
                if (!DeviceId.HasValue) return "Multiple";
                if (Devices == null || Devices.Count == 0) return "Unknown ";
                return Devices[0].Name;
            }
        }

        public string BatchName
        {
            get
            {
                if (!BatchId.HasValue) return "Multiple";
                if (Batches == null || Batches.Count == 0) return "Unknown ";
                return Batches[0].Description;
            }
        }
    }

    public class BatchSummary
    {
        public BatchSummary() { }
        public BatchSummary(Batch b, dynamic ls, dynamic le, dynamic lx, dynamic ln, dynamic lh, dynamic ll, dynamic la)
        {
            BatchId = b.BatchId;
            Description = b.Description;
            StartDate = b.StartDate;
            EndDate = b.EndDate;

            if (ls != null)
            {
                FirstLogDate = ls.Date;
                StartGravity = ls.Gravity;
                StartTemperature = ls.Temperature;
                TempUnits = ls.TempUnits;
            };

            if (le != null)
            {
                LastLogDate = le.Date;
                EndGravity = le.Gravity;
                EndTemperature = le.Temperature;
            };

            if (lx != null) MaxGravity = lx.Gravity;
            if (ln != null) MinGravity = ln.Gravity;
            if (lx != null) MaxTemperature = lh.Temperature;
            if (ln != null) MinTemperature = ll.Temperature;
            if (la != null) AvgTemperature = la.Temperature;
        }
        public Guid BatchId { get; set; }
        public string Description { get; set; }
        public string TempUnits { get; set; }

        [Display(Name = "Start")]
        public DateTime StartDate { get; set; }

        [DisplayFormat(DataFormatString = "{0:0.000}")]
        public decimal? StartGravity { get; set; }
        
        [DisplayFormat(DataFormatString = "{0:0.0}")]
        public decimal? StartTemperature { get; set; }
        
        [Display(Name = "End")]
        public DateTime? EndDate { get; set; }
        
        [DisplayFormat(DataFormatString = "{0:0.000}")]
        public decimal? EndGravity { get; set; }
        
        [DisplayFormat(DataFormatString = "{0:0.0}")]
        public decimal? EndTemperature { get; set; }
        
        public DateTime? FirstLogDate { get; set; }
        
        public DateTime? LastLogDate { get; set; }
        [DisplayFormat(DataFormatString = "{0:0.000}")]
        public decimal? MaxGravity { get; set; }
        
        [DisplayFormat(DataFormatString = "{0:0.000}")]
        public decimal? MinGravity { get; set; }
        
        [DisplayFormat(DataFormatString = "{0:0.0}")]
        public decimal? MaxTemperature { get; set; }
        
        [DisplayFormat(DataFormatString = "{0:0.0}")]
        public decimal? MinTemperature { get; set; }
        
        [DisplayFormat(DataFormatString = "{0:0.0}")]
        public decimal? AvgTemperature { get; set; }

        [DisplayFormat(DataFormatString = "{0:0.00}%")]
        public decimal? Abv
        {
            get
            {
                if (!StartGravity.HasValue || !EndGravity.HasValue) return null;
                return (StartGravity - EndGravity) * (decimal?)131.25;
            }
        }

        [DisplayFormat(DataFormatString = "{0:0.00}%")]
        [Display(Name = "Abv H/L")]
        public decimal? AbvMaxMin
        {
            get
            {
                if (!MinGravity.HasValue || !MaxGravity.HasValue) return null;
                return (MaxGravity - MinGravity) * (decimal?)131.25;
            }
        }

        [DisplayFormat(DataFormatString = "{0:0.000} days")]
        public decimal? Duration
        {
            get
            {
                if (!FirstLogDate.HasValue || !LastLogDate.HasValue) return null;
                var t = LastLogDate - FirstLogDate;
                return (decimal)t.Value.Ticks / (decimal)TimeSpan.TicksPerDay;
            }
        }
        public bool IsDetail { get; set; } = false;
    }

    public class DeviceSummary
    {
        public DeviceSummary() { }
        public DeviceSummary(Device d, Log l)
        {
            DeviceId = d.DeviceId;
            Name = d.Name;
            Token = d.Token;
            SpindelId = d.SpindelId;
            Description = d.Description;

            if (l == null) return;
            Date = l.Date;
            Angle = l.Angle;
            Temperature = l.Temperature;
            TempUnits = l.TempUnits;
            Battery = l.Battery;
            Gravity = l.Gravity;
            Interval = l.Interval;
            RSSI = l.RSSI;
        }

        public Guid DeviceId { get; set; }
        public string Name { get; set; }    // This is what's used to match up the iSpindel to this DB
        public string Token { get; set; }    // This could be used for authorisation
        [Display(Name = "Spindel Id")]
        public int? SpindelId { get; set; }
        public string Description { get; set; }

        [Display(Name = "Last Log")]
        public DateTime? Date { get; set; }
        public decimal? Angle { get; set; }
        [DisplayFormat(DataFormatString = "{0:0.0}")]
        [Display(Name = "Temp")]
        public decimal? Temperature { get; set; }
        public string TempUnits { get; set; }
        public decimal? Battery { get; set; }
        [DisplayFormat(DataFormatString = "{0:0.000}")]
        public decimal? Gravity { get; set; }
        public int? Interval { get; set; }
        public int? RSSI { get; set; }

        public bool IsDetail { get; set; } = false;
    }

    public class LogSummary
    {
        public Guid? BatchId { get; set; }
        public DateTime? Date { get; set; }
        public decimal? Gravity { get; set; }
    }
}
