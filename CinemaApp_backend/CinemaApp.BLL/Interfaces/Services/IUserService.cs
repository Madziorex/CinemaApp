using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Services
{
    public interface IUserService
    {
        Task<string?> LoginAsync(UserLoginDto user);
        Task<string?> CreateAsync(UserRegisterDto user);
        Task UpdateAsync(string id, UserDto user);
        Task DeleteAsync(string id);
        Task SetAdminAsync(string id, Role role);
    }
}
