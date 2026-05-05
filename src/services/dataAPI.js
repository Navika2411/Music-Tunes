const BASE_URL = process.env.NEXT_PUBLIC_SAAVN_API || "https://jiosaavn-api-sigma-sandy.vercel.app";

const transformData = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(transformItem);
  }
  return transformItem(data);
};

const transformItem = (item) => {
  if (!item) return item;
  const newItem = { ...item };
  
  // Ensure name/title consistency
  if (item.title && !item.name) newItem.name = item.title;
  if (item.name && !item.title) newItem.title = item.name;
  
  // Handle images
  if (Array.isArray(item.image)) {
    newItem.image = item.image.map(img => ({ 
      ...img, 
      url: img.link || img.url || (typeof img === 'string' ? img : '') 
    }));
  } else if (typeof item.image === 'string') {
    newItem.image = [{ url: item.image }, { url: item.image }, { url: item.image }];
  }
  
  // Handle download URLs
  if (Array.isArray(item.downloadUrl)) {
    newItem.downloadUrl = item.downloadUrl.map(dl => ({ 
      ...dl, 
      url: dl.link || dl.url || (typeof dl === 'string' ? dl : '') 
    }));
  }

  // Handle artists structure for frontend expectations
  if (item.primaryArtists && !item.artists) {
    const artistNames = typeof item.primaryArtists === 'string' 
      ? item.primaryArtists.split(',').map(s => s.trim())
      : Array.isArray(item.primaryArtists) ? item.primaryArtists.map(a => a.name || a) : [];
      
    newItem.artists = {
      primary: artistNames.map(name => ({ name }))
    };
  }

  // Recursive transformation for nested objects
  if (item.songs && Array.isArray(item.songs)) {
    newItem.songs = transformData(item.songs);
  }
  if (item.albums && Array.isArray(item.albums)) {
    newItem.albums = transformData(item.albums);
  }
  if (item.album && typeof item.album === 'object') {
    newItem.album = transformItem(item.album);
  }
  
  return newItem;
};

const transformModules = (modules) => {
  if (!modules) return modules;
  const newModules = { ...modules };
  Object.keys(newModules).forEach(key => {
    const module = newModules[key];
    if (Array.isArray(module)) {
      newModules[key] = transformData(module);
    } else if (module && typeof module === 'object') {
      if (Array.isArray(module.songs)) module.songs = transformData(module.songs);
      if (Array.isArray(module.albums)) module.albums = transformData(module.albums);
      if (Array.isArray(module.playlists)) module.playlists = transformData(module.playlists);
      if (Array.isArray(module.data)) module.data = transformData(module.data);
    }
  });
  return newModules;
};

// home page data
export async function homePageData(language) {
  try {
    const response = await fetch(
      `${BASE_URL}/modules?language=${language.toString()}`,
      {
        next: {
          revalidate: 14400,
        },
      }
    );
    const data = await response.json();
    return transformModules(data?.data);
  } catch (error) {
    console.log(error);
  }
}

// get song data
export async function getSongData(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/songs?id=${id}`
    );
    const data = await response.json();
    return transformData(data?.data);
  } catch (error) {
    console.log(error);
  }
}

// get album data
export async function getAlbumData(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/albums?id=${id}`
    );
    const data = await response.json();
    return transformData(data?.data);
  } catch (error) {
    console.log(error);
  }
}

// get playlist data
export async function getplaylistData(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/playlists?id=${id}&limit=50`
    );
    const data = await response.json();
    return transformData(data?.data);
  } catch (error) {
    console.log(error);
  }
}

// get Lyrics data
export async function getlyricsData(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/songs/${id}/lyrics`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// get artist data
export async function getArtistData(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/artists?id=${id}`
    );
    const data = await response.json();
    return transformData(data?.data);
  } catch (error) {
    console.log(error);
  }
}

// get artist songs
export async function getArtistSongs(id, page) {
  try {
    const response = await fetch(
      `${BASE_URL}/artists/${id}/songs?page=${page}`
    );
    const data = await response.json();
    return transformData(data?.data);
  } catch (error) {
    console.log(error);
  }
}

// get artist albums
export async function getArtistAlbums(id, page) {
  try {
    const response = await fetch(
      `${BASE_URL}/artists/${id}/albums?page=${page}`
    );
    const data = await response.json();
    return transformData(data?.data);
  } catch (error) {
    console.log("album error", error);
  }
}

// get search data
export async function getSearchedData(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/all?query=${query}`
    );
    const data = await response.json();
    const result = data?.data;
    if (result) {
      if (result.songs?.results) result.songs.results = transformData(result.songs.results);
      if (result.albums?.results) result.albums.results = transformData(result.albums.results);
      if (result.playlists?.results) result.playlists.results = transformData(result.playlists.results);
      if (result.artists?.results) result.artists.results = transformData(result.artists.results);
    }
    return result;
  } catch (error) {
    console.log(error);
  }
}

// add and remove from favourite
export async function addFavourite(id) {
  try {
    const response = await fetch("/api/favourite", {
      method: "POST",
      body: JSON.stringify(id),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Add favourite API error", error);
  }
}

// get favourite
export async function getFavourite() {
  try {
    const response = await fetch("/api/favourite");
    const data = await response.json();
    return data?.data?.favourites;
  } catch (error) {
    console.log("Get favourite API error", error);
  }
}

// user info
export async function getUserInfo() {
  try {
    const response = await fetch("/api/userInfo");
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log("Get user info API error", error);
  }
}

// reset password
export async function resetPassword(password, confirmPassword, token) {
  try {
    const response = await fetch("/api/forgotPassword", {
      method: "PUT",
      body: JSON.stringify({ password, confirmPassword, token }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Reset password API error", error);
  }
}

// send reset password link
export async function sendResetPasswordLink(email) {
  try {
    const response = await fetch("/api/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Send reset password link API error", error);
  }
}

// get  recommended songs
export async function getRecommendedSongs(artistId, songId) {
  try {
    const response = await fetch(
      `${BASE_URL}/songs/${songId}/suggestions`
    );
    const data = await response.json();
    return transformData(data?.data);
  } catch (error) {
    console.log(error);
  }
}
