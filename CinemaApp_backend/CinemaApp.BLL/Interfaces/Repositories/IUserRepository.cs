using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<PaginatedList<UserDto>> ListAsync(ListUserQuery listquery);
        Task<UserDto?> GetAsync(string id);
    }
}
