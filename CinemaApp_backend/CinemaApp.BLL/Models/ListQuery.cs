using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Models
{
    public class ListQuery
    {
        public int PageIndex { get; set; } = 0;
        public int PageSize { get; set; } = 10;
        public string? SearchBy { get; set; }
        public string? SearchFor { get; set; }
        public string? OrderBy { get; set; }
        public bool Ascending { get; set; } = true;
    }
}
