/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./hooks/useAuth.tsx":
/*!***************************!*\
  !*** ./hooks/useAuth.tsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Verificar se o usuário já está autenticado ao carregar a página\n        const checkAuth = async ()=>{\n            const token = localStorage.getItem(\"mindforge_token\");\n            if (!token) {\n                setIsLoading(false);\n                return;\n            }\n            try {\n                const response = await fetch(\"/api/auth/verify\", {\n                    headers: {\n                        Authorization: `Bearer ${token}`\n                    }\n                });\n                if (!response.ok) {\n                    throw new Error(\"Token inv\\xe1lido\");\n                }\n                // Se o token for válido, buscar dados do perfil\n                const profileResponse = await fetch(\"/api/auth/profile\", {\n                    headers: {\n                        Authorization: `Bearer ${token}`\n                    }\n                });\n                if (!profileResponse.ok) {\n                    throw new Error(\"Erro ao buscar perfil\");\n                }\n                const profileData = await profileResponse.json();\n                setUser(profileData.data);\n            } catch (error) {\n                console.error(\"Erro de autentica\\xe7\\xe3o:\", error);\n                localStorage.removeItem(\"mindforge_token\");\n            } finally{\n                setIsLoading(false);\n            }\n        };\n        checkAuth();\n    }, []);\n    const login = async (email, password)=>{\n        setIsLoading(true);\n        setError(null);\n        try {\n            const response = await fetch(\"/api/auth/login\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    email,\n                    password\n                })\n            });\n            const data = await response.json();\n            if (!response.ok) {\n                throw new Error(data.message || \"Erro ao fazer login\");\n            }\n            localStorage.setItem(\"mindforge_token\", data.data.token);\n            setUser(data.data.user);\n            router.push(\"/dashboard\");\n        } catch (error) {\n            setError(error instanceof Error ? error.message : \"Ocorreu um erro inesperado\");\n            throw error;\n        } finally{\n            setIsLoading(false);\n        }\n    };\n    const register = async (userData)=>{\n        setIsLoading(true);\n        setError(null);\n        try {\n            const response = await fetch(\"/api/auth/register\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify(userData)\n            });\n            const data = await response.json();\n            if (!response.ok) {\n                throw new Error(data.message || \"Erro ao registrar\");\n            }\n            localStorage.setItem(\"mindforge_token\", data.data.token);\n            setUser(data.data.user);\n            router.push(\"/dashboard\");\n        } catch (error) {\n            setError(error instanceof Error ? error.message : \"Ocorreu um erro inesperado\");\n            throw error;\n        } finally{\n            setIsLoading(false);\n        }\n    };\n    const logout = ()=>{\n        localStorage.removeItem(\"mindforge_token\");\n        setUser(null);\n        router.push(\"/login\");\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            isLoading,\n            isAuthenticated: !!user,\n            login,\n            register,\n            logout,\n            error\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\pedro\\\\OneDrive\\\\Documentos\\\\Estudos\\\\ProjectMindforge\\\\frontend\\\\hooks\\\\useAuth.tsx\",\n        lineNumber: 163,\n        columnNumber: 5\n    }, undefined);\n};\nconst useAuth = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (!context) {\n        throw new Error(\"useAuth deve ser usado dentro de um AuthProvider\");\n    }\n    return context;\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useAuth);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUk7WUFDbEM7WUFFQXJCLGFBQWFzQixPQUFPLENBQUMsbUJBQW1CWCxLQUFLQSxJQUFJLENBQUNaLEtBQUs7WUFDdkRQLFFBQVFtQixLQUFLQSxJQUFJLENBQUNwQixJQUFJO1lBQ3RCTSxPQUFPMEIsSUFBSSxDQUFDO1FBQ2QsRUFBRSxPQUFPNUIsT0FBTztZQUNkQyxTQUFTRCxpQkFBaUJZLFFBQVFaLE1BQU0wQixPQUFPLEdBQUc7WUFDbEQsTUFBTTFCO1FBQ1IsU0FBVTtZQUNSRCxhQUFhO1FBQ2Y7SUFDRjtJQUVBLE1BQU1nQyxTQUFTO1FBQ2IxQixhQUFhYSxVQUFVLENBQUM7UUFDeEJyQixRQUFRO1FBQ1JLLE9BQU8wQixJQUFJLENBQUM7SUFDZDtJQUVBLHFCQUNFLDhEQUFDbkMsWUFBWXVDLFFBQVE7UUFDbkJDLE9BQU87WUFDTHJDO1lBQ0FFO1lBQ0FvQyxpQkFBaUIsQ0FBQyxDQUFDdEM7WUFDbkJ1QjtZQUNBVTtZQUNBRTtZQUNBL0I7UUFDRjtrQkFFQ0w7Ozs7OztBQUdQLEVBQUU7QUFFSyxNQUFNd0MsVUFBVTtJQUNyQixNQUFNQyxVQUFVL0MsaURBQVVBLENBQUNJO0lBRTNCLElBQUksQ0FBQzJDLFNBQVM7UUFDWixNQUFNLElBQUl4QixNQUFNO0lBQ2xCO0lBRUEsT0FBT3dCO0FBQ1QsRUFBRTtBQUVGLGlFQUFlRCxPQUFPQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWluZGZvcmdlLy4vaG9va3MvdXNlQXV0aC50c3g/ZmJhOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlRWZmZWN0LCBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuXHJcbnR5cGUgVXNlciA9IHtcclxuICBpZDogc3RyaW5nO1xyXG4gIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgZW1haWw6IHN0cmluZztcclxuICBwcmltYXJ5RWxlbWVudGFsVHlwZTogc3RyaW5nO1xyXG4gIGxldmVsOiBudW1iZXI7XHJcbiAgZXhwZXJpZW5jZTogbnVtYmVyO1xyXG4gIGhvdXNlOiB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gIH07XHJcbiAgYXR0cmlidXRlcz86IHtcclxuICAgIGhlYWx0aDogbnVtYmVyO1xyXG4gICAgcGh5c2ljYWxBdHRhY2s6IG51bWJlcjtcclxuICAgIHNwZWNpYWxBdHRhY2s6IG51bWJlcjtcclxuICAgIHBoeXNpY2FsRGVmZW5zZTogbnVtYmVyO1xyXG4gICAgc3BlY2lhbERlZmVuc2U6IG51bWJlcjtcclxuICAgIHNwZWVkOiBudW1iZXI7XHJcbiAgfTtcclxufTtcclxuXHJcbmludGVyZmFjZSBBdXRoQ29udGV4dFR5cGUge1xyXG4gIHVzZXI6IFVzZXIgfCBudWxsO1xyXG4gIGlzTG9hZGluZzogYm9vbGVhbjtcclxuICBpc0F1dGhlbnRpY2F0ZWQ6IGJvb2xlYW47XHJcbiAgbG9naW46IChlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIHJlZ2lzdGVyOiAodXNlckRhdGE6IFJlZ2lzdGVyRGF0YSkgPT4gUHJvbWlzZTx2b2lkPjtcclxuICBsb2dvdXQ6ICgpID0+IHZvaWQ7XHJcbiAgZXJyb3I6IHN0cmluZyB8IG51bGw7XHJcbn1cclxuXHJcbmludGVyZmFjZSBSZWdpc3RlckRhdGEge1xyXG4gIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgZW1haWw6IHN0cmluZztcclxuICBwYXNzd29yZDogc3RyaW5nO1xyXG4gIHByaW1hcnlFbGVtZW50YWxUeXBlOiBzdHJpbmc7XHJcbiAgaW50ZXJlc3RzOiBzdHJpbmdbXTtcclxufVxyXG5cclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0PEF1dGhDb250ZXh0VHlwZSB8IG51bGw+KG51bGwpO1xyXG5cclxuZXhwb3J0IGNvbnN0IEF1dGhQcm92aWRlciA9ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9KSA9PiB7XHJcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGU8VXNlciB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgLy8gVmVyaWZpY2FyIHNlIG8gdXN1w6FyaW8gasOhIGVzdMOhIGF1dGVudGljYWRvIGFvIGNhcnJlZ2FyIGEgcMOhZ2luYVxyXG4gICAgY29uc3QgY2hlY2tBdXRoID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtaW5kZm9yZ2VfdG9rZW4nKTtcclxuICAgICAgXHJcbiAgICAgIGlmICghdG9rZW4pIHtcclxuICAgICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL2F1dGgvdmVyaWZ5Jywge1xyXG4gICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUb2tlbiBpbnbDoWxpZG8nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU2UgbyB0b2tlbiBmb3IgdsOhbGlkbywgYnVzY2FyIGRhZG9zIGRvIHBlcmZpbFxyXG4gICAgICAgIGNvbnN0IHByb2ZpbGVSZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL2F1dGgvcHJvZmlsZScsIHtcclxuICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghcHJvZmlsZVJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm8gYW8gYnVzY2FyIHBlcmZpbCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwcm9maWxlRGF0YSA9IGF3YWl0IHByb2ZpbGVSZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgc2V0VXNlcihwcm9maWxlRGF0YS5kYXRhKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvIGRlIGF1dGVudGljYcOnw6NvOicsIGVycm9yKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnbWluZGZvcmdlX3Rva2VuJyk7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY2hlY2tBdXRoKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBsb2dpbiA9IGFzeW5jIChlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiB7XHJcbiAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XHJcbiAgICBzZXRFcnJvcihudWxsKTtcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2FwaS9hdXRoL2xvZ2luJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsLCBwYXNzd29yZCB9KSxcclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBcclxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UgfHwgJ0Vycm8gYW8gZmF6ZXIgbG9naW4nKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21pbmRmb3JnZV90b2tlbicsIGRhdGEuZGF0YS50b2tlbik7XHJcbiAgICAgIHNldFVzZXIoZGF0YS5kYXRhLnVzZXIpO1xyXG4gICAgICByb3V0ZXIucHVzaCgnL2Rhc2hib2FyZCcpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgc2V0RXJyb3IoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnT2NvcnJldSB1bSBlcnJvIGluZXNwZXJhZG8nKTtcclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlZ2lzdGVyID0gYXN5bmMgKHVzZXJEYXRhOiBSZWdpc3RlckRhdGEpID0+IHtcclxuICAgIHNldElzTG9hZGluZyh0cnVlKTtcclxuICAgIHNldEVycm9yKG51bGwpO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL2F1dGgvcmVnaXN0ZXInLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHVzZXJEYXRhKSxcclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBcclxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UgfHwgJ0Vycm8gYW8gcmVnaXN0cmFyJyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtaW5kZm9yZ2VfdG9rZW4nLCBkYXRhLmRhdGEudG9rZW4pO1xyXG4gICAgICBzZXRVc2VyKGRhdGEuZGF0YS51c2VyKTtcclxuICAgICAgcm91dGVyLnB1c2goJy9kYXNoYm9hcmQnKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHNldEVycm9yKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ09jb3JyZXUgdW0gZXJybyBpbmVzcGVyYWRvJyk7XHJcbiAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBsb2dvdXQgPSAoKSA9PiB7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnbWluZGZvcmdlX3Rva2VuJyk7XHJcbiAgICBzZXRVc2VyKG51bGwpO1xyXG4gICAgcm91dGVyLnB1c2goJy9sb2dpbicpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXJcclxuICAgICAgdmFsdWU9e3tcclxuICAgICAgICB1c2VyLFxyXG4gICAgICAgIGlzTG9hZGluZyxcclxuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6ICEhdXNlcixcclxuICAgICAgICBsb2dpbixcclxuICAgICAgICByZWdpc3RlcixcclxuICAgICAgICBsb2dvdXQsXHJcbiAgICAgICAgZXJyb3IsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VBdXRoID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuICBcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aCBkZXZlIHNlciB1c2FkbyBkZW50cm8gZGUgdW0gQXV0aFByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXNlQXV0aDsgIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSb3V0ZXIiLCJBdXRoQ29udGV4dCIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwidXNlciIsInNldFVzZXIiLCJpc0xvYWRpbmciLCJzZXRJc0xvYWRpbmciLCJlcnJvciIsInNldEVycm9yIiwicm91dGVyIiwiY2hlY2tBdXRoIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicmVzcG9uc2UiLCJmZXRjaCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwib2siLCJFcnJvciIsInByb2ZpbGVSZXNwb25zZSIsInByb2ZpbGVEYXRhIiwianNvbiIsImRhdGEiLCJjb25zb2xlIiwicmVtb3ZlSXRlbSIsImxvZ2luIiwiZW1haWwiLCJwYXNzd29yZCIsIm1ldGhvZCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwibWVzc2FnZSIsInNldEl0ZW0iLCJwdXNoIiwicmVnaXN0ZXIiLCJ1c2VyRGF0YSIsImxvZ291dCIsIlByb3ZpZGVyIiwidmFsdWUiLCJpc0F1dGhlbnRpY2F0ZWQiLCJ1c2VBdXRoIiwiY29udGV4dCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./hooks/useAuth.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useAuth */ \"./hooks/useAuth.tsx\");\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\pedro\\\\OneDrive\\\\Documentos\\\\Estudos\\\\ProjectMindforge\\\\frontend\\\\pages\\\\_app.tsx\",\n            lineNumber: 9,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\pedro\\\\OneDrive\\\\Documentos\\\\Estudos\\\\ProjectMindforge\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBMEI7QUFFSztBQUNpQjtBQUVoRCxTQUFTRSxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQy9DLHFCQUNFLDhEQUFDSCx3REFBWUE7a0JBQ1gsNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUI7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL21pbmRmb3JnZS8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcclxuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuLi9ob29rcy91c2VBdXRoJztcclxuXHJcbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPEF1dGhQcm92aWRlcj5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgPC9BdXRoUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7ICJdLCJuYW1lcyI6WyJSZWFjdCIsIkF1dGhQcm92aWRlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();