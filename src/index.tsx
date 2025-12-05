import "./app/globals.css"
import "@fontsource/roboto-mono/300.css"
import "@fontsource/roboto-mono/400.css"
import "@fontsource/roboto-mono/500.css"
import "@fontsource/roboto-mono/700.css"
import "@fontsource/dm-sans/300.css"
import "@fontsource/dm-sans/400.css"
import "@fontsource/dm-sans/500.css"
import "@fontsource/dm-sans/700.css"

import * as React from "react"
import * as ReactDOM from "react-dom/client"

import { HashRouter, Route, Routes } from "react-router-dom"

import { Navigate } from "react-router-dom"

import HomePage from "./app/HomePage"
import ArnsPage from "./app/arns/ArnsPage"
import BlockPage from "./app/block/[slug]/BlockPage"
import BlocksPage from "./app/blocks/BlocksPage"
import EntityPage from "./app/entity/[slug]/EntityPage"
import { MessagePage } from "./app/message/[slug]/MessagePage"
import { ModulePage } from "./app/module/[slug]/ModulePage"
import TokenPage from "./app/token/[slug]/TokenPage"
import RootLayoutUI from "./components/RootLayout/RootLayoutUI"
import { ARIO_PROCESS_ID, ARIO_MODULE_ID, ARIO_TOKEN_ID } from "./config/ario"
import { FourZeroFourPage } from "./pages/404"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <RootLayoutUI>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/message/:messageId" element={<MessagePage />} />
        <Route path="/blocks" element={<BlocksPage />} />
        <Route path="/block/:blockHeight" element={<BlockPage />} />
        {/* Module route redirects to AR.IO module */}
        <Route path="/module" element={<Navigate to={`/module/${ARIO_MODULE_ID}`} replace />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        {/* Process route redirects to AR.IO process */}
        <Route path="/process" element={<Navigate to={`/entity/${ARIO_PROCESS_ID}`} replace />} />
        <Route path="/entity/:entityId" element={<EntityPage />} />
        {/* Token route redirects to AR.IO token */}
        <Route path="/token" element={<Navigate to={`/token/${ARIO_TOKEN_ID}`} replace />} />
        <Route path="/token/:tokenId" element={<TokenPage />} />
        <Route path="/arns" element={<ArnsPage />} />
        <Route path="*" element={<FourZeroFourPage />} />
      </Routes>
    </RootLayoutUI>
  </HashRouter>,
)
