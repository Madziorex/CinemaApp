using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Linq.Dynamic.Core;

namespace CinemaApp.BLL.Models
{
    public class PaginatedList<T>
    {
        public List<T> Items { get; private set; }
        public int PageIndex { get; private set; }
        public int TotalPages { get; private set; }

        public PaginatedList(List<T> items, int count, int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);

            Items = items;
        }

        public bool HasPreviousPage => PageIndex > 0;

        public bool HasNextPage => PageIndex < TotalPages - 1;

        public static async Task<PaginatedList<T>> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize)
        {
            var count = await source.CountAsync();

            List<T> items = new List<T>();
            if (pageIndex == -1)
                items = await source.ToListAsync();
            else
                items = await source.Skip(pageIndex * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedList<T>(items, count, pageIndex, pageSize);
        }

        public static IQueryable<T> ApplySearchAndSorting<T>(IQueryable<T> query, string? searchBy, string? searchFor, string? orderBy, bool ascending)
        {
            if (!string.IsNullOrEmpty(searchFor) && !string.IsNullOrEmpty(searchBy))
            {
                if (IsValidProperty<T>(searchBy) == false)
                {
                    throw new Exception($"Unable to search by: {searchBy}");
                }

                var propertyType = typeof(T).GetProperty(searchBy)?.PropertyType;
                if (propertyType == typeof(DateTime) || propertyType == typeof(DateTime?))
                {
                    if (DateTime.TryParse(searchFor, out DateTime searchDate))
                    {
                        query = query.Where(r =>
                            EF.Property<DateTime>(r, "StartDate") <= searchDate &&
                            EF.Property<DateTime>(r, "EndDate") >= searchDate
                        );
                    }
                    else
                    {
                        throw new Exception($"Unable to parse search date: {searchFor}");
                    }
                }
                else if (propertyType == typeof(Guid) || propertyType == typeof(Guid?))
                {
                    searchFor = searchFor.Replace("'", "''");
                    query = query.Where($"{searchBy}.ToString().Contains(@0)", searchFor);
                }
                else if (propertyType == typeof(bool) || propertyType == typeof(bool?))
                {
                    if (bool.TryParse(searchFor, out bool searchBool))
                    {
                        query = query.Where($"{searchBy} == @0", searchBool);
                    }
                    else
                    {
                        throw new Exception($"Unable to parse search bool: {searchFor}");
                    }
                }
                else
                {
                    searchFor = searchFor.Replace("'", "''");
                    query = query.Where($"{searchBy}.Contains(@0)", searchFor);
                }
            }

            if (!string.IsNullOrEmpty(orderBy))
            {
                if (IsValidProperty<T>(orderBy) == false)
                {
                    throw new Exception($"Unable to order by: {orderBy}");
                }

                query = ascending
                    ? query.OrderBy(orderBy)
                    : query.OrderBy($"{orderBy} descending");
            }

            return query;
        }

        private static bool IsValidProperty<T>(string propertyName)
        {
            return typeof(T).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance) != null;
        }
    }
}
