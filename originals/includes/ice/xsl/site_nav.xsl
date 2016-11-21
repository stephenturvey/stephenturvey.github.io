<?xml version="1.0" encoding="UTF-8"?>
<!-- XML to location-sensitive nested HTML by Prominent Media Ltd (http://www.prominentmedia.com/) -->
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" omit-xml-declaration="yes" indent="yes"/>
  <xsl:strip-space elements="page" />
  <xsl:param name="this_page" />
  
    <xsl:template match="site">
    <div class="context-nav">
            <xsl:call-template name="createList"/>
    </div>
    </xsl:template>
  
    <xsl:template name="createList">
      <xsl:if test="descendant-or-self::page[not(@type = 'utility')]/link = $this_page">
        <xsl:if test="count(child::page[not(@type = 'utility')]) > 0">
          <ul>
            <xsl:for-each select="page[not(@type = 'utility')]">
                <li>
		<xsl:if test="class"> 
			<xsl:attribute name="class"><xsl:value-of select="class"/></xsl:attribute> 
		</xsl:if> 
                <xsl:choose>
		    <xsl:when test="link = $this_page">
		    	<strong><xsl:value-of select="title"/></strong>
		    </xsl:when>
		    <xsl:otherwise>
			  <xsl:element name="a">
			    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
			    <xsl:value-of select="title"/>
			  </xsl:element>
		    </xsl:otherwise>
                  </xsl:choose>
                  <xsl:call-template name="createList"/>
                </li>
            </xsl:for-each>
          </ul>
        </xsl:if>
      </xsl:if>
  </xsl:template>
  
  
</xsl:stylesheet>

