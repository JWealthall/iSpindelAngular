using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iSpindelAngular.Models
{
    public class SpindelLog
    {
        public string name { get; set; }
        public int? ID { get; set; }
        public string token { get; set; }
        public decimal? angle { get; set; }
        public decimal? temperature { get; set; }
        public string temp_units { get; set; }
        public decimal? battery { get; set; }
        public decimal? gravity { get; set; }
        public int? interval { get; set; }
        public int? RSSI { get; set; }
    }
}
