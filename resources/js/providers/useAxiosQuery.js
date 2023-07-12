import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import companyInfo from "./companyInfo";
import $ from "jquery";
// import { Empty } from "antd";
const apiUrl = companyInfo().apiUrl;
const token = companyInfo().token;

export function POST(url, key_name, showLoading = true, onSuccessFunction) {
    const queryClient = useQueryClient();
    return useMutation(
        (data) => {
            if (showLoading) {
                $(".globalLoading").removeClass("hide");
            }
            return axios
                .post(`${apiUrl}${url}`, data, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((res) => res.data);
        },
        {
            onSuccess: () => {
                if (onSuccessFunction) onSuccessFunction();
                if (key_name) {
                    if (typeof key_name === "string") {
                        queryClient.refetchQueries(key_name);
                    } else {
                        key_name.forEach((name) => {
                            queryClient.refetchQueries(name);
                        });
                    }
                }
                $(".globalLoading").addClass("hide");
            },
            onError: () => {
                $(".globalLoading").addClass("hide");
            },
        }
    );
}

export function POSTFILE(url, key_name, showLoading = true, onSuccessFunction) {
    const queryClient = useQueryClient();
    return useMutation(
        (data) => {
            if (showLoading) {
                $(".globalLoading").removeClass("hide");
            }
            return axios
                .post(`${apiUrl}${url}`, data, {
                    headers: {
                        Authorization: token,
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => res.data);
        },
        {
            onSuccess: () => {
                if (onSuccessFunction) onSuccessFunction();
                if (key_name) {
                    if (typeof key_name === "string") {
                        queryClient.refetchQueries(key_name);
                    } else {
                        key_name.forEach((name) => {
                            queryClient.refetchQueries(name);
                        });
                    }
                }
                $(".globalLoading").addClass("hide");
            },
            onError: () => {
                $(".globalLoading").addClass("hide");
            },
        }
    );
}

export function UPDATE(url, key_name, showLoading = true, onSuccessFunction) {
    const queryClient = useQueryClient();

    return useMutation(
        (data) => {
            if (showLoading) {
                $(".globalLoading").removeClass("hide");
            }
            return axios
                .put(`${apiUrl}${url}/${data.id}`, data, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((res) => res.data);
        },
        {
            onSuccess: () => {
                if (onSuccessFunction) onSuccessFunction();
                // console.log(key_name);
                if (key_name) {
                    if (typeof key_name === "string") {
                        queryClient.refetchQueries(key_name);
                    } else {
                        key_name.forEach((name) => {
                            queryClient.refetchQueries(name);
                        });
                    }
                }
                $(".globalLoading").addClass("hide");
            },
            onError: () => {
                $(".globalLoading").addClass("hide");
            },
        }
    );
}

export function DELETE(url, key_name, showLoading = true, onSuccessFunction) {
    const queryClient = useQueryClient();

    return useMutation(
        (data) => {
            if (showLoading) {
                $(".globalLoading").removeClass("hide");
            }
            return axios
                .delete(`${apiUrl}${url}/${data.id}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((res) => res.data);
        },
        {
            onSuccess: () => {
                if (onSuccessFunction) onSuccessFunction();
                if (key_name) {
                    if (typeof key_name === "string") {
                        queryClient.refetchQueries(key_name);
                    } else {
                        key_name.forEach((name) => {
                            queryClient.refetchQueries(name);
                        });
                    }
                }
                $(".globalLoading").addClass("hide");
            },
            onError: () => {
                $(".globalLoading").addClass("hide");
            },
        }
    );
}

export function GET(url, key_name, onSuccessFunction, showLoading = true) {
    return useQuery(
        key_name,
        () => {
            if (showLoading) {
                $(".globalLoading").removeClass("hide");
            }

            return axios
                .get(`${apiUrl}${url}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((res) => res.data);
        },
        {
            retry: 1,
            retryDelay: 500,
            fetchOnWindowFocus: false,
            refetchOnWindowFocus: false,
            onSuccess: (res) => {
                if (onSuccessFunction) onSuccessFunction(res);
                $(".globalLoading").addClass("hide");
            },
            onError: () => {
                $(".globalLoading").addClass("hide");
            },
        }
    );
}

export function GETMANUAL(
    url,
    key_name,
    onSuccessFunction,
    showLoading = true
) {
    return useQuery(
        key_name,
        () => {
            if (showLoading === true) {
                $(".globalLoading").removeClass("hide");
            }

            return axios
                .get(`${apiUrl}${url}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((res) => res.data);
        },
        {
            enabled: false,
            retry: 1,
            retryDelay: 500,
            fetchOnWindowFocus: false,
            refetchOnWindowFocus: false,
            onSuccess: (res) => {
                if (onSuccessFunction) onSuccessFunction(res);
                $(".globalLoading").addClass("hide");
            },
            onError: () => {
                $(".globalLoading").addClass("hide");
            },
        }
    );
}

export function POSTMANUAL(
    settoken,
    url,
    key_name,
    showLoading = true,
    onSuccessFunction
) {
    const queryClient = useQueryClient();
    return useMutation(
        (data) => {
            if (showLoading) {
                $(".globalLoading").removeClass("hide");
            }
            return axios
                .post(`${apiUrl}${url}`, data, {
                    headers: {
                        Authorization: settoken,
                    },
                })
                .then((res) => res.data);
        },
        {
            onSuccess: () => {
                if (onSuccessFunction) onSuccessFunction();
                if (key_name) {
                    if (typeof key_name === "string") {
                        queryClient.refetchQueries(key_name);
                    } else {
                        key_name.forEach((name) => {
                            queryClient.refetchQueries(name);
                        });
                    }
                }
                $(".globalLoading").addClass("hide");
            },
            onError: () => {
                $(".globalLoading").addClass("hide");
            },
        }
    );
}
