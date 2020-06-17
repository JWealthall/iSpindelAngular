using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace iSpindelAngular.Models
{
    public class BaseData
    {
        // This is purely so we can pass messages back from the business/data layers
        [NotMapped] public StatusData StatusData { get; set; } = new StatusData();
    }

    public class StatusData
    {
        [NotMapped] public int Code { get; set; } = 0;
        [NotMapped] public string Message { get; set; }

        public bool Failed(int code, string message)
        {
            Code = code;
            Message = message;
            return false;
        }

        public static StatusData Failure(string message) { return new StatusData() { Code = -1, Message = message }; }
        public static StatusData Failure(int code, string message) { return new StatusData() { Code = code, Message = message }; }
    }

    public class Batch : BaseData
    {
        [Display(Name = "Batch Id")]
        public Guid BatchId { get; set; } = Guid.NewGuid();

        [MaxLength(50)]
        public string Description { get; set; }

        [Display(Name = "Start Date")]
        public DateTime StartDate { get; set; } = DateTime.UtcNow.TrimToSecond();

        [Display(Name = "End Date")]
        public DateTime? EndDate { get; set; }

        [Display(Name = "Device Id")]
        public Guid DeviceId { get; set; }

        public List<Log> Logs { get; set; }

        public Batch Failure(string message) => Failure(-1, message);
        public Batch Failure(int code, string message)
        {
            StatusData = StatusData.Failure(code, message);
            return this;
        }
    }

    public class Device : BaseData
    {
        [Display(Name = "Device Id")]
        public Guid DeviceId { get; set; } = Guid.NewGuid();

        [MaxLength(50)]
        [Required]
        public string Name { get; set; }    // This is what's used to match up the iSpindel to this DB

        [MaxLength(100)]
        public string Token { get; set; }    // This could be used for authorisation

        [Display(Name = "Spindel Id")]
        public int? SpindelId { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }

        public List<Log> Logs { get; set; }
        public List<Batch> Batches { get; set; }

        public Device Failure(string message) => Failure(-1, message);
        public Device Failure(int code, string message)
        {
            StatusData = StatusData.Failure(code, message);
            return this;
        }
    }

    public class Log : BaseData
    {
        public Guid LogId { get; set; } = Guid.NewGuid();
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(8, 5)")]
        [DisplayFormat(DataFormatString = "{0:0.00}")]
        public decimal? Angle { get; set; }

        [Column(TypeName = "decimal(7, 3)")]
        [DisplayFormat(DataFormatString = "{0:0.0}")]
        public decimal? Temperature { get; set; }

        [MaxLength(1)]
        public string TempUnits { get; set; }

        [Column(TypeName = "decimal(8, 6)")]
        [DisplayFormat(DataFormatString = "{0:0.000}")]
        public decimal? Battery { get; set; }

        [Column(TypeName = "decimal(8, 6)")]
        [DisplayFormat(DataFormatString = "{0:0.000}")]
        public decimal? Gravity { get; set; }

        public int? Interval { get; set; }
        public int? RSSI { get; set; }
        public Guid DeviceId { get; set; }
        public Guid? BatchId { get; set; }

        public Log Failure(string message) => Failure(-1, message);
        public Log Failure(int code, string message)
        {
            StatusData = StatusData.Failure(code, message);
            return this;
        }
    }
}
